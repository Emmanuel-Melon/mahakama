# pgvector Migration & Shadow-Write Reconciliation

**Status:** Draft
**Date:** 2026-08-19
**Author:** Spec-first workflow (human + agent)

---

## 1. Problem Statement

The system originally used ChromaDB as the sole vector store for legal document embeddings. During the migration to pgvector (Postgres-native vector storage), a dual-write strategy was introduced: writes go to both stores simultaneously, reads serve from a configurable primary. However, the original implementation had two gaps:

1. **Shadow-write failures were only logged, not persisted.** If the shadow store (ChromaDB or pgvector) failed to accept a write, the error was logged and forgotten — leaving the two stores permanently out of sync with no mechanism to repair the drift.

2. **The pgvector store's `addDocuments` was broken.** The store tried to match VectorRecord IDs (`law_<documentId>-<index>-<version>`) against `document_chunks.id` (auto-generated UUIDs), which never matched. This meant the pgvector-primary path silently failed on every ingestion.

**Goal:** Make the dual-store architecture reliable by persisting shadow-write failures to a write-ahead log (WAL) and replaying them via a scheduled background job, while fixing the underlying ID mismatch that prevented pgvector from working as primary.

---

## 2. Architecture Overview

### Write Modes

Controlled by `EMBEDDING_WRITE_MODE` and `EMBEDDING_PRIMARY_STORE` env vars:

| `writeMode` | `primaryStore` | Writes go to      | Reads from | Shadow   |
| ----------- | -------------- | ----------------- | ---------- | -------- |
| `pgvector`  | `pgvector`     | pgvector only     | pgvector   | —        |
| `chroma`    | `chroma`       | Chroma only       | Chroma     | —        |
| `dual`      | `pgvector`     | pgvector + Chroma | pgvector   | Chroma   |
| `dual`      | `chroma`       | Chroma + pgvector | Chroma     | pgvector |

Default: `writeMode: "pgvector"`, `primaryStore: "pgvector"`.

### Composite Store Pattern

```
createCompositeStore({ primary, shadow? })
  ├─ addDocuments()
  │    ├─ primary.addDocuments()        // errors propagate → request fails
  │    └─ shadow.addDocuments()         // errors caught → logged to WAL
  ├─ getDocumentsByIds() → primary only
  └─ query() → primary only
```

Shadow writes are fire-and-forget: the request succeeds as long as the primary write succeeds. Failed shadow writes are recorded for asynchronous replay.

### Ingestion Pipeline Order

```
saveDocumentChunks()          // DELETE old rows for documentId → INSERT new rows
  ↓
generateDocumentEmbeddings()  // vectorStore.addDocuments() → composite store writes
  ↓
versionCleanup()              // DELETE previous version from Chroma (if chunkVersion > 1)
```

The critical property: `saveDocumentChunks` deletes ALL rows for a `documentId` before inserting new ones. This means old-version data is gone from the primary store (pgvector) before the replay job can ever read it.

---

## 3. The ID Mismatch Fix (`vectorId` column)

### Problem

`buildChunkId()` produces IDs like `law_<documentId>-<index>-v<version>`. But `saveDocumentChunks` never set `document_chunks.id` — Postgres generated random UUIDs via `defaultRandom()`. The pgvector store's `addDocuments` tried to match `eq(documentChunksTable.id, r.id)`, which compared a UUID against a prefixed string — never matching.

### Solution

Added a `vector_id` text column to `document_chunks` that stores the stable vector-store identifier. New code sets `vectorId: buildChunkId(chunk)` on insert. The pgvector store matches on `vectorId` instead of `id`.

**Schema change:**

```sql
ALTER TABLE document_chunks ADD COLUMN vector_id text;
CREATE INDEX vector_id_idx ON document_chunks (vector_id);
-- Backfill existing rows:
UPDATE document_chunks
SET vector_id = 'law_' || document_id || '-' || chunk_index || COALESCE('-v' || version, '')
WHERE vector_id IS NULL;
```

**Files changed:**

- `embeddings.schema.ts` — new column + index
- `embeddings.types.ts` — `chunkIndex` added to `DocumentChunk`
- `rag.chunker.ts` — `chunkIndex: index` set on each chunk
- `embeddings.utils.ts` — `chunk_index` added to metadata
- `embeddings.insert.ts` — `vectorId: buildChunkId(chunk)` in insert
- `pgvector.store.ts` — all lookups use `vectorId`
- `shadow-replay.job.ts` — reads `vectorId` for replay records

---

## 4. Shadow-Write Failure WAL

### Table: `shadow_write_failures`

| Column            | Type      | Description                                                  |
| ----------------- | --------- | ------------------------------------------------------------ |
| `id`              | UUID PK   | Auto-generated                                               |
| `collection_name` | text      | ChromaDB collection name                                     |
| `record_ids`      | text[]    | VectorRecord IDs that failed to write                        |
| `shadow_store`    | text      | Name of the shadow store (`"chroma"` or `"pgvector"`)        |
| `primary_store`   | text      | Name of the primary store                                    |
| `retry_count`     | integer   | Number of replay attempts (default 0)                        |
| `last_error`      | text      | Most recent error message                                    |
| `created_at`      | timestamp | When the failure was recorded                                |
| `resolved_at`     | timestamp | NULL = unresolved; set when replay succeeds or is superseded |

### Failure Recording (composite store)

When `shadow.addDocuments()` throws:

1. Log the error with record IDs and store name
2. Insert a row into `shadow_write_failures`
3. The API request succeeds (primary write already completed)

---

## 5. Shadow-Write Replay Job

### Behavior

A scheduled BullMQ job runs every `EMBEDDING_REPLAY_INTERVAL_MS` (default 5 minutes, 300000ms). Only active when `writeMode: "dual"`.

**Per run:**

1. Fetch up to 100 unresolved failures (`resolvedAt IS NULL AND retryCount < 5`)
2. For each failure:
   a. Look up the shadow store by name
   b. Read the current records from the primary store by `vectorId`
   c. Attempt `shadow.addDocuments()`
   d. On success → set `resolvedAt = now()`
   e. On failure → increment `retryCount`, update `lastError`
3. After 5 retries, the failure is left unresolved (no more automatic attempts)
4. Housekeeping: delete resolved failures older than 7 days

### Reading from the primary store

| Primary store | How records are read                                                                       |
| ------------- | ------------------------------------------------------------------------------------------ |
| pgvector      | `SELECT ... FROM document_chunks WHERE vector_id IN (...)` — returns embeddings + metadata |
| ChromaDB      | `chromaClient.getDocumentsByIds(collection, ids)` — returns embeddings + metadata          |

### Retry limits

| Retries | Action                                                               |
| ------- | -------------------------------------------------------------------- |
| 0–4     | Automatic replay on next scheduler run                               |
| 5       | Left unresolved — logged as warning, available for manual inspection |

### Configuration

| Env var                        | Default          | Description                     |
| ------------------------------ | ---------------- | ------------------------------- |
| `EMBEDDING_WRITE_MODE`         | `pgvector`       | `chroma`, `pgvector`, or `dual` |
| `EMBEDDING_PRIMARY_STORE`      | `pgvector`       | Which store serves reads        |
| `EMBEDDING_REPLAY_INTERVAL_MS` | `300000` (5 min) | How often the replay job runs   |

---

## 6. Stale Data Analysis

### Question

If a document is re-ingested (v1 → v2 → v3) and the shadow write fails for v1, can the replay job reintroduce stale v1 data?

### Answer: No — `saveDocumentChunks` prevents this

The ingestion pipeline deletes ALL rows for a `documentId` before inserting new ones:

```ts
// embeddings.insert.ts:27-29
await db
  .delete(documentChunksTable)
  .where(eq(documentChunksTable.documentId, documentId));
```

When v2 is ingested:

1. v1 rows are **deleted** from `document_chunks`
2. v2 rows are inserted
3. v2 embeddings are generated and written to the vector store
4. Version cleanup deletes v1 from Chroma (if `chunkVersion > 1`)

By the time the replay job picks up the v1 failure:

- **pgvector-primary:** v1 rows don't exist in `document_chunks` → `readRecordsFromPgvector` returns empty → resolved
- **Chroma-primary:** v1 was deleted by version cleanup → `readRecordsFromChroma` returns empty → resolved

### Edge cases examined

| Scenario                                                 | Stale data possible? | Why                                                                                          |
| -------------------------------------------------------- | -------------------- | -------------------------------------------------------------------------------------------- |
| Normal re-ingestion                                      | No                   | Old rows deleted by `saveDocumentChunks` before replay runs                                  |
| Pipeline crash after shadow fail, before version cleanup | No                   | `saveDocumentChunks` already deleted old rows from Postgres                                  |
| `saveDocumentChunks` delete fails                        | No                   | Throws on failure → job retries → eventually succeeds                                        |
| Version cleanup fails (Chroma down)                      | No                   | Stale data stays in Chroma, but replay reads from primary (Postgres) where old rows are gone |

### Conclusion

A supersession check (comparing `document.version` against the failure's version) is **not required** for correctness. The DELETE-then-INSERT pattern in `saveDocumentChunks` provides a natural safeguard. A supersession check could be added as a belt-and-suspenders optimization to skip pointless replay attempts faster, but it is not necessary for data integrity.

---

## 7. Files Changed

### Schema

| File                   | Change                                                                                    |
| ---------------------- | ----------------------------------------------------------------------------------------- |
| `embeddings.schema.ts` | Added `vectorId` column + index on `document_chunks`; added `shadow_write_failures` table |

### Config

| File               | Change                                              |
| ------------------ | --------------------------------------------------- |
| `config.types.ts`  | Added `replayIntervalMs` to `embeddingConfigSchema` |
| `config/index.ts`  | Loads `EMBEDDING_REPLAY_INTERVAL_MS` env var        |
| `bullmq.config.ts` | Added `ShadowReplay` to `QueueName` enum            |

### Vector Store

| File                       | Change                                            |
| -------------------------- | ------------------------------------------------- |
| `stores/index.ts`          | Shadow write catch block persists failures to WAL |
| `stores/pgvector.store.ts` | All lookups match on `vectorId` instead of `id`   |

### Ingestion Pipeline

| File                   | Change                                                            |
| ---------------------- | ----------------------------------------------------------------- |
| `embeddings.types.ts`  | Added `chunkIndex` to `DocumentChunk`                             |
| `rag.chunker.ts`       | Sets `chunkIndex` on each chunk                                   |
| `embeddings.utils.ts`  | Includes `chunk_index` in metadata                                |
| `embeddings.insert.ts` | Sets `vectorId` on insert; `generateDocumentEmbeddings` unchanged |

### Replay Job (new)

| File                              | Purpose                                              |
| --------------------------------- | ---------------------------------------------------- |
| `jobs/shadow-replay.config.ts`    | Job name constant                                    |
| `jobs/shadow-replay.types.ts`     | Payload type                                         |
| `jobs/shadow-replay.queue.ts`     | Typed BullMQ queue                                   |
| `jobs/shadow-replay.worker.ts`    | Worker with handler dispatch                         |
| `jobs/shadow-replay.job.ts`       | Core replay logic + housekeeping                     |
| `jobs/shadow-replay.scheduler.ts` | Interval scheduler (active when `writeMode: "dual"`) |

### Registration

| File             | Change                                                                   |
| ---------------- | ------------------------------------------------------------------------ |
| `bullmq.init.ts` | Registers `initShadowReplayWorker()` + `registerShadowReplayScheduler()` |

### Backfill

| File                              | Change                                         |
| --------------------------------- | ---------------------------------------------- |
| `embeddings.backfill-pgvector.ts` | Sets `vectorId` when backfilling from ChromaDB |

---

## 8. Migration Steps

```bash
# 1. Generate migration (picks up shadow_write_failures + vector_id column)
npm run drizzle:generate --workspace=server

# 2. Apply migration
npm run drizzle:migrate --workspace=server

# 3. Verify types
npm run typecheck --workspace=api

# 4. Verify build
npm run build --workspace=api
```

---

## 9. Sign-Off

- [x] Human confirms spec is correct
- [x] Agent will build only what's in this spec
- [x] Agent will ask before extending scope

---

**Next Steps:** Implementation complete — run migration and verify.
