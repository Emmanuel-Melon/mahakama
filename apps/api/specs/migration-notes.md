# Mahakama: Chroma → pgvector Migration Notes

Status: Chroma remains `primaryStore`, pgvector is being written to in shadow
mode via `createCompositeStore`. This document tracks findings from a review
of the current implementation — store layer (`pgvector.store.ts`,
`chroma.store.ts`, `stores/index.ts`), schema/types/config
(`embeddings.schema.ts`, `embeddings.types.ts`, `embeddings.config.ts`,
`embeddings.factory.ts`, `embeddings.utils.ts`), the shadow-replay job
pipeline (`embeddings.job.ts`, `embeddings.worker.ts`,
`embeddings.scheduler.ts`, `embeddings.queue.ts`), the Ollama provider
(`ollama.provider.ts`), and the Chroma→pgvector backfill script — and what
needs to be resolved before `primaryStore` can safely switch to `pgvector`.

## Critical — blocks cutover

### 1. Backfill script builds the wrong Chroma vector id

`backfillPgVectorFromChroma` selects only `documentChunksTable.id` (the
Postgres row's own random UUID primary key) and reconstructs a Chroma id as
`` `${EMBEDDING_CONFIG.ID_PREFIX}${row.id}` ``. That's not how vector ids are
actually built — `buildChunkId` uses the chunk's _logical_ `chunk.id` plus a
`-v{version}` suffix when versioned, and the table already has the correct
id stored in its own `vectorId` column. `row.id` (the Postgres PK) and the
original `chunk.id` used to create the Chroma entry are different values.

Practically this means the backfill will look up ids in Chroma that don't
exist there, log "Missing from Chroma — cannot backfill" for nearly every
row, and skip re-embedding. Worse, on the rare row where the guess happens
to collide with something, the success path _overwrites_ the correct
existing `vectorId` with the wrong reconstructed one, which then breaks
every future lookup for that chunk in `pgVectorStore.addDocuments` /
`readRecordsFromPgvector` (both match on `vectorId`).

**Action:** select `vectorId` (not `id`) from `documentChunksTable` and use
the existing value directly as the Chroma lookup id. Drop the id
reconstruction and the `vectorId:` overwrite in the update.

### 2. `collectionName` is not respected by pgvector

`pgVectorStore.query` and `pgVectorStore.addDocuments` both take
`_collectionName` and ignore it. All chunks live in a single flat
`document_chunks` table with no column encoding "collection." In Chroma,
collections gave real isolation (e.g. per-jurisdiction or per-document-type
indexes); pgvector's `query()` currently does a global nearest-neighbor
search across every jurisdiction and act ever embedded.

The schema _has_ a `jurisdiction` column, and it's returned in metadata, but
nothing filters on it. For a multi-jurisdiction legal-empowerment product,
this means a query about Ugandan tenancy law could return a closer-matching
Kenyan or Rwandan section instead. This is a correctness issue, not just a
performance one — it can put wrong-jurisdiction law in front of a user
asking for legal help.

This same gap breaks the backfill script's `collectionName` parameter too:
Postgres has no column recording which Chroma collection a chunk came from,
so `backfillPgVectorFromChroma` can only ever check one collection at a
time against _all_ rows missing an embedding — chunks that legitimately
belong to a different collection will be misreported as "missing from
Chroma."

**Action:** decide what "collection" should map to in pgvector (jurisdiction?
act? document type?) and add the corresponding `WHERE` filter to `query()`
(and to the backfill's row selection), or add a real `collection` column if
the mapping isn't 1:1 with existing columns.

### 3. No version filtering in `query()`

Chunks carry a `version` field, but results aren't restricted to the latest
version per document. A superseded section of a law can rank alongside (or
above) its replacement in search results.

**Action:** filter to latest version per `documentId` (or per act/section) in
the pgvector query, or confirm whether old versions are deliberately kept
queryable and, if so, whether the RAG prompt makes that clear to the model.

## High — should fix before cutover

### 4a. Reprocessing a document orphans vectors in Chroma

`saveDocumentChunks` deletes all `document_chunks` rows for a `documentId`
and reinserts fresh ones on every call — this is how it stays idempotent
across job retries. For pgvector that's self-cleaning: the embedding lives
on the same row, so deleting the row deletes the embedding with it. Chroma
is a separate store keyed only by `vectorId`, and nothing deletes the old
Chroma entries when a document is reprocessed with different chunk
boundaries. Chunks that existed in a prior chunking but not the current one
leave their vectors behind in Chroma indefinitely — still queryable, still
returned by `chromaStore.query()`, serving text that no longer matches the
current `document_chunks` state.

This also undermines any future parity check between Chroma and pgvector
before cutover (Chroma will always look "ahead" by however many orphaned
chunks have accumulated across reprocessing events).

**Action:** before or during `saveDocumentChunks`'s delete step, also
delete the corresponding vectors from Chroma (by the old `vectorId`s), or
add a periodic reconciliation job that diffs Chroma ids against current
`document_chunks.vector_id` values and removes anything not present.

### 4b. Embedded text and stored content diverge between stores

`generateDocumentEmbeddings` embeds `` `${chunk.title}. ${chunk.content}` ``
and stores that exact string as Chroma's `document` field. But
`saveDocumentChunks` wrote only `chunk.content` (no title) to the `content`
column pgvector reads from. Same logical chunk, two different passage
strings depending on which store answers the query — the vector reflects
title+content semantics, but a pgvector-served result won't include the
title that was actually embedded, while a Chroma-served result will. This
will silently change RAG passage formatting at cutover.

**Action:** decide on one canonical stored/returned text (with or without
title prefix) and make both `content` and the embedded string match it.

### 4. `addDocuments` is not atomic

Writes are `N` independent `UPDATE ... RETURNING` calls fired via
`Promise.all`, then checked for which ids came back.

- If the batch partially succeeds (e.g. a dropped connection mid-batch),
  some embeddings are already committed but the whole batch throws as if it
  fully failed. The shadow-failure/replay path has no way to distinguish
  "nothing was written" from "half was written," so a replay could
  double-write, or a retry could skip chunks that are actually still
  unembedded.
- It's `BATCH_SIZE` (currently 20) separate round trips instead of one bulk
  statement. Fine at the current batch size, but doesn't scale if
  `EMBEDDING_CONFIG.BATCH_SIZE` grows.

**Action:** replace with a single bulk `UPDATE ... FROM (VALUES ...) AS
v(id, embedding, provider, model) WHERE document_chunks.vector_id = v.id`,
wrapped in one transaction, so the batch is atomic and one round trip.

### 5. Two-phase write invariant is implicit

`addDocuments` assumes the metadata row (from `saveDocumentChunks`) already
exists for every chunk it's about to UPDATE, and throws if it doesn't. This
is a reasonable design, but nothing in the types enforces the ordering —
correctness depends on every caller remembering to run the metadata write
first, for every chunk the embedding fill will later touch.

**Action:** add a comment at the call site documenting this invariant, or an
assertion/job-level check that metadata rows exist before an embedding job
starts.

### 6. Permanently-failed shadow writes go silent

`handleReplay` only selects failures where `retryCount < MAX_RETRIES`. Once
a failure's `retryCount` reaches `MAX_RETRIES` (5), it logs one warning and
then simply stops being selected — `resolvedAt` is never set. That row now
sits in `shadow_write_failures` forever: excluded from further replay
attempts (good) but _also_ excluded from the housekeeping delete, which only
removes rows where `resolvedAt` is set. There's no metric, alert, or
dashboard implied anywhere in this code — a permanently-diverged shadow
write becomes invisible after its one log line.

**Action:** give exhausted failures a distinct terminal state (e.g. a
`status` column, or reuse `resolvedAt` with a `lastError` sentinel) so
they're queryable/alertable, and decide on a retention policy for them
separate from the "resolved" cleanup path.

### 7. Unknown shadow store is marked "resolved"

If `failure.shadowStore` isn't in `SHADOW_STORES`, the handler logs a
warning and sets `resolvedAt`, i.e. marks it exactly like a successful
replay. That's a configuration bug (a stored store name that doesn't match
a registered store) being silently treated as "handled" — the shadow write
is permanently lost with no distinct signal from a real success.

**Action:** log at error level and leave it unresolved (or route to a
separate dead-letter marker) rather than reusing the success path.

## Medium — worth doing, not blocking

### 8. Partial reads during replay are treated as full success

`handleReplay` calls `readRecordsFromPrimary(...)` for a failure's
`recordIds`, and only special-cases `records.length === 0` (marks resolved,
nothing to backfill). If the primary returns _some but not all_ of the
requested records — e.g. one chunk was deleted, or has since lost its
embedding — the handler still writes whatever it got to the shadow store and
marks the entire failure resolved. The missing subset is never retried and
never logged as missing.

**Action:** compare `records.length` against `failure.recordIds.length` and
handle the partial case explicitly (log which ids are missing, or split the
failure so the found subset resolves while the missing subset stays open).

### 9. `retryCount` increment isn't atomic

On failure, the handler does
`.set({ retryCount: failure.retryCount + 1, ... })` using the in-memory
value from the initial `select`, not `sql\`${retryCount} + 1\``. If two
processes ever touch the same row concurrently (e.g. a manual replay trigger
overlapping the scheduled one), one update can clobber the other and
understate the true attempt count. Low likelihood given
`upsertJobScheduler`'s single-schedule guarantee, but worth closing given
`MAX_RETRIES` is a correctness boundary (see #6).

**Action:** use an atomic increment in the `UPDATE` (`sql\`retry_count +
1\``) instead of read-then-write.

### 10. Ollama provider has no concurrency limit, retry, or timeout

`createOllamaProvider.embed` fires one HTTP request per text via
`Promise.all` with no concurrency cap. For a batch of 20+ chunks this sends
20+ concurrent requests to a single local Ollama instance, which is likely
to queue, throttle, or time out under load. There's also no retry/backoff on
transient failures and no `fetch` timeout — one slow or hung request can
block the whole `embed()` call indefinitely, and any single failure aborts
the entire batch rather than just the failed text.

**Action:** add a concurrency limiter (e.g. `p-limit`), per-request retry
with backoff, and an explicit fetch timeout/abort signal.

### 11. No result sanitization in pgvector query

`chromaStore.query` explicitly drops rows with a null `document` or
`distance` and logs it (specifically to avoid feeding empty legal text into
an answer). `pgVectorStore.query` has no equivalent, though the risk is
lower there since `content` is `notNull()` in the schema and the query
already filters `embedding IS NOT NULL`.

**Action:** low priority, but worth a matching guard for defense-in-depth
and parity between the two store implementations.

### 12. `getDocumentsByIds` return shape differs between stores

`chromaStore.getDocumentsByIds` returns whatever `chromaClient` gives back
(documents, embeddings, metadatas, ids). `pgVectorStore.getDocumentsByIds`
strictly returns `{ ids }` per the `VectorStore` interface. Harmless today
since callers only appear to use `.ids`, but if anything downstream ever
relied on Chroma's extra fields, switching `primaryStore` to pgvector would
break it silently.

**Action:** tighten `chromaStore`'s return to match the declared interface,
or widen the interface if the extra fields are genuinely used somewhere.

### 13a. `saveDocumentChunks`'s delete+insert isn't transactional

The delete and the bulk insert are two separate statements, not wrapped in
`db.transaction()`. If the insert fails after the delete succeeds (a
constraint violation on one row, a dropped connection), the document has
zero rows in `document_chunks` until the job retries — a real, if narrow,
window where the document has no chunks at all.

**Action:** wrap both statements in a single transaction.

### 13b. `upsertEmbeddingJob` isn't atomic

Select-then-insert-or-update, with no unique constraint on
`embeddingJobsTable.documentId` in the schema. Two concurrent calls for the
same document (e.g. a redelivered queue job, or a manual retry overlapping
a scheduled one) can both see "no existing row" and both insert, leaving
two job-status rows for one document with no clear authoritative one.

**Action:** add a unique constraint on `documentId` and use
`INSERT ... ON CONFLICT (document_id) DO UPDATE` instead of the
select-then-branch pattern.

### 13. Backfill omits `embeddingModel` and isn't batched atomically

The backfill's success path sets `embedding` and `embeddingProvider:
"backfill-chroma"` but never sets `embeddingModel`, breaking the
provenance goal called out in the schema comments (knowing which model
produced a given vector). It also issues one `UPDATE` per row via
`Promise.all`, same pattern/risk as #4.

**Action:** set `embeddingModel` from whatever's recoverable (Chroma
metadata, if present) or a explicit "unknown" sentinel; consider batching
the update.

## Open questions

- What should "collection" mean once everything is one Postgres table —
  jurisdiction, act, document type, or something else? (Affects #2 and the
  backfill script both.)
- Now that `EmbeddingsJobHandler.handleReplay` exists and is scheduled via
  `registerShadowReplayScheduler`, is there monitoring/alerting on top of
  it, or does visibility stop at the `logger` calls in this code? (See #6,
  #7.)
- If `writeMode` is switched away from `"dual"` while failures are still
  unresolved in `shadow_write_failures`, the scheduler simply stops
  registering — do those rows get handled some other way, or do they sit
  indefinitely?
- Once cutover happens, does Chroma get decommissioned, or does it stay as a
  standing shadow/fallback store indefinitely?

## Suggested order of work

1. Fix the backfill script's vector-id reconstruction (#1) — currently
   likely to silently no-op the entire backfill. Now confirmed against
   `saveDocumentChunks`: `vectorId` and the Postgres row's own `id` are
   provably different values.
2. Fix collection/jurisdiction filtering in pgvector `query()` and the
   backfill row selection (#2).
3. Add version filtering (#3).
4. Clean up orphaned Chroma vectors on document reprocessing (#4a), and
   reconcile the embedded-text vs. stored-content mismatch (#4b) — both
   affect data quality on the store(s) currently serving traffic, not just
   pgvector readiness.
5. Make `addDocuments` a single atomic bulk update (#4), and apply the same
   pattern to the backfill script (#13).
6. Document/enforce the two-phase write invariant (#5).
7. Give exhausted/unknown-store replay failures a real terminal state
   distinct from "resolved" (#6, #7), and fix the partial-read case (#8).
8. Atomic retry-count increment (#9).
9. Harden the Ollama provider: concurrency limit, retry/backoff, timeout
   (#10).
10. Parity fixes (#11, #12, #13, #13a, #13b) — can land any time before
    cutover.
11. Only then flip `primaryStore` to `pgvector`.
