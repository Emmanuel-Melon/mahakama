# Document Ingestion — Current State & Backlog (Write-Path)

> Living plan for the document ingestion pipeline (upload → Chroma). This is the **write-path** of the RAG system; the read-path is covered in [`rag.md`](./rag.md). Entry point: [`README.md`](./README.md).
>
> Status legend: ✅ complete · 🟡 partial · ❌ stub/broken · 🔴 dead code (unused or references missing modules)
>
> All paths are relative to `api/`.

---

## 1. Current State (by layer)

### 1.1 Entry points (HTTP)

| File | Status | Notes |
| --- | --- | --- |
| `src/feature/documents/documents.routes.ts` | ✅ | `POST /v1/documents/ingest` (`upload.single("file")`), `POST /v1/documents` (metadata-only), `GET /`, `GET /:documentId`, `POST /:documentId/bookmark`, `GET /:documentId/download`; mounted behind auth in `src/routes/index.ts` |
| `src/feature/documents/controllers/ingest-document.controller.ts` | ✅ | multer memory → `saveUploadedFile` (local `uploads/`) → `createDocument` → SSE (subscribe-before-enqueue, `started`, relay, terminal `completed`/`error`, keep-alive + timeout) → `documentsQueue.add(DocumentUploaded)` in try/catch |
| `src/feature/documents/controllers/create-document.controller.ts` | ✅ | Metadata-only create (normalizes `storageUrl`: `http(s)://` as-is, `/`-relative → `serverConfig.baseUrl` prefix, else `https://`); enqueue-after-response wrapped in try/catch + log (no SSE — JSON 201). Enqueues for both local paths and external `http(s)` URLs (worker fetches remote PDFs via `parsePdfFromUrl`); passes the real `size` (via `fs.statSync`) for local files |
| `src/feature/documents/controllers/download-document.controller.ts` | ✅ | Increments download count + returns document JSON (dead fire-and-forget PDF parse removed) |
| OpenAPI spec (`documents.docs.ts`) | ✅ | `POST /v1/documents/ingest` documented as `text/event-stream` SSE (`started/progress/content/completed/error`); `docs/feature/documents/index.md` prose is stale (still shows the old pre-SSE pipeline) |

### 1.2 File handling

| File | Status | Notes |
| --- | --- | --- |
| `src/middleware/multer.ts` | ✅ | PDF-only (`application/pdf`) via `fileFilter`; size cap `MAX_UPLOAD_MB` (default 25MB); Multer/filter errors map to 400 in `errors.ts` |
| `src/lib/storage/storage.ts` | ✅ | `saveUploadedFile` (writes `uploads/<timestamp>-<name>`, returns `{ storagePath, publicUrl }` where `publicUrl = ${serverConfig.baseUrl}/uploads/<file>`), `getStoragePath` (traversal-guarded, **throws on external http(s) URLs**), `readStoredFile`, `ensureStorageDir`; served publicly at `/uploads` (see [`storage.md`](./storage.md)) |
| `src/lib/pdf-parse/index.ts` | ✅ | `parsePdf` (pdf-parse, accepts `ArrayBuffer | Uint8Array` — Buffer views passed directly, no pooled-`buffer.buffer` bug) + `parsePdfFromPath` + `parsePdfFromUrl` |

### 1.3 Data layer

| File | Status | Notes |
| --- | --- | --- |
| `src/feature/documents/documents.schema.ts` | 🟡 | `documents` table is metadata-only (title, description, type, sections, lastUpdated, storageUrl, downloadCount) — **no status/content columns**; bookmarks/downloads tables used |
| `src/service/embedding-service/embeddings.schema.ts` | ✅ | `document_chunks` + `embedding_jobs` tables written by the worker (I3.2); pgvector column/index commented out |
| `src/feature/documents/documents.types.ts` | ✅ | `DocumentIngestionEvent` SSE schema + `LegalDocumentChunk` + `DocumentJobMap` — used by the ingest flow |

### 1.4 Business logic

| File | Status | Notes |
| --- | --- | --- |
| `src/feature/documents/operations/documents.create.ts` | ✅ | `createDocument` insert — used by both controllers |
| `src/feature/documents/operations/documents.ingest.ts` | 🗑 | Deleted (was fully unused — `ingestDocument`/`runBulkImport`/`uploadAndRegisterLocalFile`) |
| `src/feature/documents/operations/document.find.ts` | ✅ | `findDocumentById`, `findDocuments` (type filter + title/description search) |
| `src/feature/documents/operations/documents.update.ts` | ✅ | `downloadDocument` (used by download controller) |

### 1.5 Background processing (the intended pipeline)

| File | Status | Notes |
| --- | --- | --- |
| `src/feature/documents/jobs/documents.queue.ts` | ✅ | `documentsQueue` on `QueueName.Documents`; `DocumentJobMap` = `DocumentUploaded { documentId, userId }` |
| `src/feature/documents/jobs/documents.worker.ts` | ✅ | `initDocumentsWorker` registers `DocumentUploaded` → `handleDocumentUploaded`; started via `bullmq.init.ts` |
| `src/feature/documents/jobs/documents.jobs.ts` | ✅ | Pipeline: `findDocumentById` → PDF text extraction (local `parsePdfFromPath(getStoragePath(storageUrl))` or external `parsePdfFromUrl`) → `chunkDocument` (0-chunk docs fail loudly with `NO_EXTRACTABLE_TEXT`, no retries) → `generateDocumentEmbeddings` (`legal_questions`) → `chromaClient.addDocuments`; `content`/`progress` SSE emitted **per completed embed batch** (via `onBatchProgress`), then `job.updateProgress(100)`; `markEmbeddingJobFailed` on final failure |
| `src/lib/bullmq/bullmq.init.ts` | ✅ | Documents worker enabled (`initDocumentsWorker()`); chat/message/inference workers off |
| `src/lib/bullmq/bullmq.config.ts` | ✅ | 3 attempts, exponential backoff 2s; worker concurrency 5 |

### 1.6 Chunking & embeddings

| File | Status | Notes |
| --- | --- | --- |
| `src/service/rag-service/rag.chunker.ts` | ✅ | Real `chunkDocument` (I2.1): ~1000 chars, 200 overlap, word-boundary aware; `id = ${documentId}-${index}` |
| `src/service/embedding-service/embeddings.generate.ts` | ✅ | `generateDocumentEmbeddings` (batches of 20, ids `law_${id}`, metadata id/title/section/category/source/content_length/imported_at); per-batch progress callback; **per-batch id verification via `get({ ids })`** — retry-safe, throws if any batch id is missing |
| `src/service/embedding-service/embeddings.store.ts` | 🗑 | Deleted (dead code) |
| `src/lib/chroma/index.ts` | ✅ | CloudClient + Ollama `nomic-embed-text`; add/query/peek/count/`getDocumentsByIds`; `getOrCreateCollection` **throws on failure** (no longer silently returns `undefined`) |

### 1.7 Seed / import tooling

| File | Status | Notes |
| --- | --- | --- |
| `src/feature/documents/scripts/import-laws-to-chroma.ts` | ✅ | Self-invoking entry importing `laws.dataset.ts` (I5.1); batches of 20, clean `process.exit(0/1)` |
| `src/feature/lawyers/scripts/*` | 🗑 | Deleted (empty `laws` variant + duplicate retrieve script) |
| `api/package.json` `chroma:import-laws` / `chroma:search-laws` | ✅ | Repointed to the documents scripts |
| `src/service/rag-service/dataset/laws.dataset.ts` | ✅ | ~596 lines of Uganda laws (id/title/category/source/content) — imported by `chroma:import-laws` |

### 1.8 Frontend touchpoints

| File | Status | Notes |
| --- | --- | --- |
| `frontend/app/lib/api/documents.api.ts` | ✅ | `getDocuments` / `getDocumentById` + **`uploadDocument`** (FormData → `POST /v1/documents/ingest`, streams SSE: `started/progress/content/completed/error`, auth token from cookie) |
| `frontend/app/feature/documents/hooks/use-documents.ts` | ✅ | `useUploadDocument` — sequential per-file upload with per-file `uploading/completed/error` + percentage, returns success boolean |
| `frontend/app/components/ui/upload-dropdown.tsx` + `frontend/app/feature/chats/components/chat-form.tsx` | ✅ | Dropdown narrowed to `.pdf` (image option removed); files uploaded on submit before the chat is created; per-file progress/error surfaced in the attachment list |

---

## 2. Current behavior (end-to-end)

Uploading a document today:

1. **File upload** → multer in-memory, **PDF-only, max `MAX_UPLOAD_MB` (25MB default)**; violations → 400.
2. **Local disk** → written under `uploads/<timestamp>-<name>`, served publicly at `/uploads`, `publicUrl = <baseUrl>/uploads/<file>`.
3. **DB** → a metadata-only `documents` row (title, description, type, sections, year, storageUrl). Documents are **global — no ownership column** (anyone can and should upload; deliberate decision).
4. **Response** → SSE `text/event-stream` on `POST /v1/documents/ingest` (`started` immediately), 201 JSON on `POST /v1/documents`.
5. **Queue** → `DocumentUploaded` job enqueued to Redis after the SSE stream is set up (subscribe-before-enqueue; try/catch + terminal `error` event on failure). If Redis is down, the request still responds with the terminal error via SSE.
6. **Worker** → `initDocumentsWorker()` runs in `bullmq.init.ts`. The job handler: extracts PDF text (`pdf-parse` — `parsePdfFromPath` for local files, `parsePdfFromUrl` for external URLs) → `chunkDocument` (0-chunk/scan-only PDFs publish a terminal `error` `NO_EXTRACTABLE_TEXT` and mark the job FAILED, no retries) → `generateDocumentEmbeddings` → `chromaClient.addDocuments` into `legal_questions`; `content`/`progress` SSE events emitted **per completed embed batch** via `documents.progress.ts`; persists chunk/status rows in `document_chunks` + `embedding_jobs`; terminal `completed`/`error` events; `failed` listener calls `markEmbeddingJobFailed` after retries are exhausted. Chroma failures now **throw** (collection errors are not swallowed, and each batch's ids are verified via `get({ ids })` — retry-safe, unlike the old count delta) so the job fails loudly instead of silently reporting COMPLETED.
7. **Seeding** → `npm run chroma:import-laws` seeds `legal_questions` from `laws.dataset.ts` (I5.1).

**Conclusion:** uploads now reach Chroma — the ingest write-path and the RAG read-path (`legal_questions`) share the same store, and chat answers retrieve from it (see [`rag.md`](./rag.md)).

---

## 3. Ingestion Backlog (write-path, one layer per phase)

> Order reflects implementation sequence. Each phase is independently shippable and verifiable. Phases I–III are required for a functional upload→Chroma path.

### Phase I — Compile & workers
- [x] **I1.1** Fix `documents.jobs.ts` imports `@/services/...` → `@/service/...` (unblocks `tsc`). Also fixed the same broken import in `scripts/retrieve-laws-from-chroma.ts` (also blocked `tsc`).
- [x] **I1.2** Un-comment `initDocumentsWorker()` in `bullmq.init.ts` (keep chat/message/inference workers off until real handlers exist).
- [x] **I1.3** `documentsQueue.add(...)` wrapped in try/catch + log in both controllers (no post-response throw; response stays 201). **`ingestion_status` column deferred** to Phase IV (I4.1) — the status-surface decision (SSE vs. column + status endpoint) was not yet made, so no schema/migration change in Phase I.

### Phase II — Chunking
- [x] **I2.1** Implement real `chunkDocument` in `rag.chunker.ts`: recursive character split (~1000 chars, 200 overlap, word-boundary aware), returning `DocumentChunk[]` compatible with `embeddings.types.DocumentChunk`. Iterative overlapping split with word-boundary tolerance (20% of chunk size) and guaranteed forward progress; `id = ${documentId}-${index}`; `title` defaults to `documentId` but the job handler passes the real document title.
- [ ] **I2.2** (defer) Parse `[Title, Section]` from extracted text to enrich chunk metadata.

### Phase III — Embeddings metadata & persistence
- [x] **I3.1** Extend `generateDocumentEmbeddings` metadata with `section`/`category`/`source` so retrieval sources carry titles/sections (aligns with `RAGSource` in rag.md T1.3). `DocumentChunk` gained optional `section`/`category`/`source`; metadata keys match what `rag.service.retrieveContext` reads (`title`, `section`, `category`, `source`). Fields omitted when absent (Chroma rejects `undefined`).
- [x] **I3.2** Persist chunk/status rows in `document_chunks` + `embedding_jobs`. New `embeddings.persistence.ts` (`upsertEmbeddingJob` — insert-or-update per documentId, `saveDocumentChunks` — idempotent across retries, `markEmbeddingJobFailed`); job handler now records `processing → completed/failed` and persists chunk rows. Postgres stays an audit/cache — Chroma remains the vector store, no pgvector. Requires `document_chunks` + `embedding_jobs` to exist in the DB: `drizzle.config.ts` schema glob widened `src/feature/**` → + `src/service/**` (these service tables were never migrated); run `drizzle:generate` + review + `drizzle:migrate`. Note: the generated migration will also create other schema-only service tables (`auth_events`, `notifications`, `inference_models`, `inference_providers`, `user_inference_preferences`, `user_notification_preferences`). **Superseded:** the `drizzle/` folder was deleted and the DB reset (fresh start) — `drizzle:push` now applies all schema globs directly, so no migration step is needed.

### Phase IV — Progress & error handling
- [x] **I4.1** Decision: **SSE stream** on `POST /v1/documents/ingest` (status column/endpoint not built). New `documents.progress.ts` (in-process `EventEmitter` keyed by `documentId` — worker + server share a process). Controller: subscribe-before-enqueue → `started` → relay → terminal `completed`/`error` → `res.end()`; 15s `: ping` keep-alive, 600s (10 min) timeout guard (`MAX_WAIT_MS` in `ingest-document.controller.ts`), `res.on("close")` cleanup. Worker: per-chunk `content`/`progress` (before embed), `completed` on success (+`job.updateProgress(100)`), `error` only on final attempt exhaustion (stream stays open through retries). `DocumentJobMap["document-uploaded"]` + `filename`/`size`. Wire format exactly `started/progress/content/completed/error` (uses `sendEvent`, not `sendError`/`close`). Contract change: ingest returns 200 `text/event-stream` (OpenAPI docs already advertised this); `create-document` stays JSON 201.
- [x] **I4.2** Final-failure handling centralized in the worker's `failed` listener (BullMQ emits `failed` only after retries are exhausted, per `defaultBullJobOptions` attempts: 3). It logs the failure, calls `markEmbeddingJobFailed`, and publishes the terminal SSE `error` event — which also covers failures occurring before the chunk/embed pipeline (PDF parse/chunk errors). Guard `job.attemptsMade >= (job.opts.attempts ?? 1)` is kept defensively; `removeOnFail` stays `false`. The error-event emission + per-attempt `markEmbeddingJobFailed` were removed from `documents.jobs.ts` (single source of truth; intermediate retries stay `processing`).

### Phase V — Seeding & tests
- [x] **I5.1** Fix `chroma:import-laws` npm script → runnable entry that calls `importLawsToChroma(laws.dataset.ts)`; delete/redirect the empty `lawyers/scripts` variant. (Unblocks end-to-end verification.) Done: `src/feature/documents/scripts/import-laws-to-chroma.ts` rewritten as a self-invoking entry importing `laws.dataset.ts`; both `chroma:import-laws` and `chroma:search-laws` repointed; the two `lawyers/scripts/*` files deleted.
- [ ] **I5.2** Unit tests: `chunkDocument` (length/overlap/empty), `generateDocumentEmbeddings` (batch size, metadata, ids), job handler with mocked Chroma/LLM (success + retry-on-failure).

### Phase VI — Frontend
- [x] **I6.1** Add `uploadDocument(file)` to `documents.api.ts` (FormData → `POST /v1/documents/ingest`, streaming SSE); wire `UploadDropdown` in `chat-form.tsx` to call it; surface status/progress. Done: `uploadDocument` streams SSE events (`started/progress/content/completed/error`), `useUploadDocument` hook tracks per-file status/percentage, chat-form uploads attached files before creating the chat.
- [ ] **I6.2** (defer) Dedicated documents-management screen with upload + per-document status.

---

## 4. Relationship to `rag.md`

| Ingestion task | Overlaps with (rag.md) | Notes |
| --- | --- | --- |
| I1.1 (fix `@/services` imports) | T4.4 | Same fix |
| I1.2 (start ingest worker) | T4.1 | rag.md says "start with ingest worker" |
| I2.1 (real `chunkDocument`) | T2.5 | rag.md T2.5 deferred; required for ingest, not retrieval |
| I3.1 (embedding metadata) | T1.3 (`RAGSource`) | Metadata shape should match the retrieval source shape |
| I5.1 (fix seed script) | T6.1 | Same seeding fix |

- **Ordering**: rag.md's retrieval work (Phases 1–3) assumes `legal_questions` is pre-populated via I5.1 (seed). Once seeded, uploads **append** to the same collection — ingestion and retrieval share the store.
- This document is the authoritative plan for the write-path; rag.md entries above are pointers into it.

---

## 5. Known issues (documented, not yet fixed)

> Discovered in a review of the pipeline against `ingestion.md` (Aug 2026). Fixed items are logged in §6 below. Unchecked boxes are still open.

- [ ] **No admin role-gating or admin UI** — `POST /v1/documents/ingest` and `POST /v1/documents` are behind `authenticateToken` only (any authenticated user; deliberate per §2.3 of this doc — decision to keep open, see §6). The "legal database" screen is browse-only; I6.2 (dedicated upload + status screen) is still deferred.
- [ ] **No pipeline tests** (I5.2 still open): `chunkDocument`, `generateDocumentEmbeddings` (incl. retry-safe verification), and the job handler (success + retry-on-failure) are untested.

## 6. Fix log (Aug 2026)

- **Retry-safe Chroma verification** — `embeddings.generate.ts` now verifies each batch via `chromaClient.getDocumentsByIds` (`get({ ids })`) instead of a collection-count delta. On a job retry, ids written by a previous attempt are still returned by `get`, so verification passes once the batch lands — the old count check could never recover from a partial failure and exhausted all attempts.
- **Empty / scan-only PDFs** — `documents.jobs.ts` now detects `chunks.length === 0`, marks the embedding job FAILED (`NO_EXTRACTABLE_TEXT`), and publishes a terminal SSE `error` instead of silently emitting `completed` with `totalChunks: 0`.
- **First chat message answered** — new `src/service/rag-service/rag.answer.ts` (`generateAssistantReply`) shared by `POST /v1/messages` and `POST /v1/chats`; chat creation now awaits the reply inline (best-effort try/catch — chat + user message persist regardless of LLM failure). The now-redundant `chatsQueue.add(ChatCreated)` enqueue was removed (chats worker off; would have double-replied).
- **Admin metadata path embeds external URLs** — `create-document.controller.ts` enqueues external `http(s)` storage URLs and passes the real file `size` (via `statSync`) for local files; `documents.jobs.ts` fetches remote PDFs with `parsePdfFromUrl`.
- **Dead PDF parse removed** — `download-document.controller.ts` no longer fire-and-forgets `parsePdfFromPath` (result was discarded).
- **Frontend upload state** — `use-documents.ts` keys uploads by `getUploadKey(file)` (`name|lastModified|size`) so same-named files don't collide; `chat-form.tsx` clears upload state after a successful submit.
- **Decision: admin role-gating kept open** — `POST /v1/documents` remains behind `authenticateToken` only (matches the "anyone can and should upload" decision). Revisit if/when an admin-only surface (I6.2) is built.

### Schema note (fixed alongside this doc)
- `drizzle:push` failed with `column "institution_id" is in a primary key` (Postgres `42P16`). Root cause: `src/feature/services/services.schema.ts` — the `institutions_to_services` join table declared a composite PK on `(institution_id, service_id)` without `.notNull()` on either column, so drizzle-kit tried to `DROP NOT NULL` on a PK column. Fixed by marking both columns `.notNull()`. DB was reset and `drizzle/` deleted for a fresh start; `drizzle:push` applies the full schema directly.
