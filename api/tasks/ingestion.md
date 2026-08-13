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
| `src/feature/documents/documents.routes.ts` | 🟡 | `POST /v1/documents/ingest` (`upload.single("file")`), `POST /v1/documents` (metadata-only), `GET /`, `GET /:documentId`, `POST /:documentId/bookmark`, `GET /:documentId/download`; mounted behind auth in `src/routes/index.ts` |
| `src/feature/documents/controllers/ingest-document.controller.ts` | 🟡 | Real: multer memory → `saveUploadedFile` (local `uploads/`) → `createDocument` → 201 response → `documentsQueue.add(DocumentUploaded)` **after** response sent |
| `src/feature/documents/controllers/create-document.controller.ts` | 🟡 | Metadata-only create (normalizes `storageUrl`: `http(s)://` as-is, `/`-relative → `serverConfig.baseUrl` prefix, else `https://`); same enqueue-after-response pattern |
| `src/feature/documents/controllers/download-document.controller.ts` | 🟡 | Fire-and-forget `parsePdfFromPath(getStoragePath(storageUrl))` after responding, try/catch + log (unused result) |
| OpenAPI spec + `docs/feature/documents/index.md` | ❌ | Document SSE progress streaming for ingestion (`started/progress/content/completed/error`) + worker `job.updateProgress` — **never implemented**; controller returns plain JSON |

### 1.2 File handling

| File | Status | Notes |
| --- | --- | --- |
| `src/middleware/multer.ts` | 🟡 | `multer.memoryStorage()`; no file-size or type limits |
| `src/lib/storage/storage.ts` | ✅ | `saveUploadedFile` (writes `uploads/<timestamp>-<name>`, returns `{ storagePath, publicUrl }` where `publicUrl = ${serverConfig.baseUrl}/uploads/<file>`), `getStoragePath` (traversal-guarded), `readStoredFile`, `ensureStorageDir`; served publicly at `/uploads` (see [`storage.md`](./storage.md)) |
| `src/lib/pdf-parse/index.ts` | ✅ | `parsePdf` (pdf-parse) + `parsePdfFromPath` (disk read, logs first 500 chars) + `parsePdfFromUrl` (kept for external http(s) URLs) |

### 1.3 Data layer

| File | Status | Notes |
| --- | --- | --- |
| `src/feature/documents/documents.schema.ts` | 🟡 | `documents` table is metadata-only (title, description, type, sections, lastUpdated, storageUrl, downloadCount) — **no status/content columns**; bookmarks/downloads tables used |
| `src/service/embedding-service/embeddings.schema.ts` | 🟡 | `document_chunks` + `embedding_jobs` tables exist, unused; pgvector column/index commented out |
| `src/feature/documents/documents.types.ts` | 🟡 | `DocumentIngestionEvent` SSE schema + `LegalDocumentChunk` + `DocumentJobMap` defined; SSE schema unused |

### 1.4 Business logic

| File | Status | Notes |
| --- | --- | --- |
| `src/feature/documents/operations/documents.create.ts` | ✅ | `createDocument` insert — used by both controllers |
| `src/feature/documents/operations/documents.ingest.ts` | 🔴 | `ingestDocument(file)` + `runBulkImport()` (scans local `./import-queue`, p-limit 10) + `uploadAndRegisterLocalFile` — fully unused; now consistent with the controller (uses `saveUploadedFile`) |
| `src/feature/documents/operations/document.find.ts` | ✅ | `findDocumentById`, `findDocuments` (type filter + title/description search) |
| `src/feature/documents/operations/documents.update.ts` | ✅ | `downloadDocument` (used by download controller) |

### 1.5 Background processing (the intended pipeline)

| File | Status | Notes |
| --- | --- | --- |
| `src/feature/documents/jobs/documents.queue.ts` | ✅ | `documentsQueue` on `QueueName.Documents`; `DocumentJobMap` = `DocumentUploaded { documentId, userId }` |
| `src/feature/documents/jobs/documents.worker.ts` | 🟡 | `initDocumentsWorker` registers `DocumentUploaded` → `handleDocumentUploaded` — **never started** |
| `src/feature/documents/jobs/documents.jobs.ts` | ❌ | Pipeline: `findDocumentById` → `parsePdfFromPath(getStoragePath(storageUrl))` → `chunkDocument` (stub `[]`) → `generateDocumentEmbeddings` (`legal_questions`). **Broken imports** `@/services/...` (correct: `@/service/...`) → does not compile |
| `src/lib/bullmq/bullmq.init.ts` | ❌ | `initAllWorkers()` — every worker commented out; `server.ts` calls it |
| `src/lib/bullmq/bullmq.config.ts` | ✅ | 3 attempts, exponential backoff 2s; worker concurrency 5 |

### 1.6 Chunking & embeddings

| File | Status | Notes |
| --- | --- | --- |
| `src/service/rag-service/rag.chunker.ts` | ❌ | `chunkDocument` returns `[]` (stub) |
| `src/service/embedding-service/embeddings.generate.ts` | 🟡 | `generateDocumentEmbeddings` ✅ real (batches of 20, ids `law_${id}`, metadata id/title/content_length/imported_at) — metadata **lacks section/category/source**; `generateTextEmbedding` 🔴 misnamed (actually a Chroma query) |
| `src/service/embedding-service/embeddings.store.ts` | 🔴 | `storeEmbedding` misnamed (actually a query); unused |
| `src/lib/chroma/index.ts` | 🟡 | CloudClient + Ollama `nomic-embed-text`; add/query/peek/count; `getOrCreateCollection` swallows errors (logs and returns `undefined`) |

### 1.7 Seed / import tooling

| File | Status | Notes |
| --- | --- | --- |
| `src/feature/documents/scripts/import-laws-to-chroma.ts` | ❌ | `importLawsToChroma(laws)` implemented but **never invoked**; `process.exit` in `finally` |
| `src/feature/lawyers/scripts/import-laws-to-chroma.ts` | ❌ | Self-invokes `importLawsToChroma()` but `laws: any[] = []` — imports nothing |
| `api/package.json` `chroma:import-laws` | ❌ | Points to `scripts/import-laws-to-chroma.ts` — `api/scripts/` does not exist |
| `src/service/rag-service/dataset/laws.dataset.ts` | ✅ | ~596 lines of Uganda laws (id/title/category/source/content) — matches `LegalDocumentChunk`, imported nowhere |

### 1.8 Frontend touchpoints

| File | Status | Notes |
| --- | --- | --- |
| `frontend/app/lib/api/documents.api.ts` | 🟡 | `getDocuments` / `getDocumentById` only — **no upload client** |
| `frontend/app/components/ui/upload-dropdown.tsx` + `frontend/app/feature/chats/components/chat-form.tsx` | ❌ | Upload UI only accumulates `attachedFiles` in local state; files never sent (no FormData call, no `postV1documentsingest` usage despite it existing in generated types) |

---

## 2. Current behavior (end-to-end)

Uploading a document today:

1. **File upload** → multer in-memory, no validation of size/type.
2. **Local disk** → written under `uploads/<timestamp>-<name>`, served publicly at `/uploads`, `publicUrl = <baseUrl>/uploads/<file>`.
3. **DB** → a metadata-only `documents` row (title, description, type, sections, year, storageUrl).
4. **Response** → 201 with the document JSON:API resource.
5. **Queue** → `DocumentUploaded` job enqueued to Redis **after** the response is sent. If Redis is down, `documentsQueue.add(...)` throws post-response (unhandled).
6. **Worker** → **never runs** (all workers commented out in `bullmq.init.ts`). Jobs accumulate in Redis indefinitely.

The intended next steps (PDF parse → chunk → embed into Chroma `legal_questions`) exist only in `documents.jobs.ts`, which additionally **does not compile** (`@/services/...` imports) and depends on the `chunkDocument` stub.

**Conclusion: nothing reaches Chroma.** The connection between uploads and the RAG read-path (`legal_questions`) is design intent only.

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
- [x] **I3.1** Extend `generateDocumentEmbeddings` metadata with `section`/`category`/`source` so retrieval sources carry titles/sections (aligns with `RAGSource` in rag.md T1.3). `DocumentChunk` gained optional `section`/`category`/`source`; metadata keys match what `rag.retrieval.ts` already reads (`category`, `source`). Fields omitted when absent (Chroma rejects `undefined`).
- [x] **I3.2** Persist chunk/status rows in `document_chunks` + `embedding_jobs`. New `embeddings.persistence.ts` (`upsertEmbeddingJob` — insert-or-update per documentId, `saveDocumentChunks` — idempotent across retries, `markEmbeddingJobFailed`); job handler now records `processing → completed/failed` and persists chunk rows. Postgres stays an audit/cache — Chroma remains the vector store, no pgvector. Requires `document_chunks` + `embedding_jobs` to exist in the DB: `drizzle.config.ts` schema glob widened `src/feature/**` → + `src/service/**` (these service tables were never migrated); run `drizzle:generate` + review + `drizzle:migrate`. Note: the generated migration will also create other schema-only service tables (`auth_events`, `notifications`, `inference_models`, `inference_providers`, `user_inference_preferences`, `user_notification_preferences`).

### Phase IV — Progress & error handling
- [x] **I4.1** Decision: **SSE stream** on `POST /v1/documents/ingest` (status column/endpoint not built). New `documents.progress.ts` (in-process `EventEmitter` keyed by `documentId` — worker + server share a process). Controller: subscribe-before-enqueue → `started` → relay → terminal `completed`/`error` → `res.end()`; 15s `: ping` keep-alive, 60s timeout guard, `res.on("close")` cleanup. Worker: per-chunk `content`/`progress` (before embed), `completed` on success (+`job.updateProgress(100)`), `error` only on final attempt exhaustion (stream stays open through retries). `DocumentJobMap["document-uploaded"]` + `filename`/`size`. Wire format exactly `started/progress/content/completed/error` (uses `sendEvent`, not `sendError`/`close`). Contract change: ingest returns 200 `text/event-stream` (OpenAPI docs already advertised this); `create-document` stays JSON 201.
- [x] **I4.2** Final-failure handling centralized in the worker's `failed` listener (BullMQ emits `failed` only after retries are exhausted, per `defaultBullJobOptions` attempts: 3). It logs the failure, calls `markEmbeddingJobFailed`, and publishes the terminal SSE `error` event — which also covers failures occurring before the chunk/embed pipeline (PDF parse/chunk errors). Guard `job.attemptsMade >= (job.opts.attempts ?? 1)` is kept defensively; `removeOnFail` stays `false`. The error-event emission + per-attempt `markEmbeddingJobFailed` were removed from `documents.jobs.ts` (single source of truth; intermediate retries stay `processing`).

### Phase V — Seeding & tests
- [ ] **I5.1** Fix `chroma:import-laws` npm script → runnable entry that calls `importLawsToChroma(laws.dataset.ts)`; delete/redirect the empty `lawyers/scripts` variant. (Unblocks end-to-end verification.)
- [ ] **I5.2** Unit tests: `chunkDocument` (length/overlap/empty), `generateDocumentEmbeddings` (batch size, metadata, ids), job handler with mocked Chroma/LLM (success + retry-on-failure).

### Phase VI — Frontend
- [ ] **I6.1** Add `uploadDocument(file)` to `documents.api.ts` (FormData → `POST /v1/documents/ingest`); wire `UploadDropdown` in `chat-form.tsx` to call it; surface status/progress.
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
