# RAG Pipeline — Current State & Backlog (Read-Path)

> Living plan for wiring the RAG layer into the message flow. This is the **read-path** of the RAG system; the write-path (document ingestion → Chroma) is covered in [`ingestion.md`](./ingestion.md). Entry point: [`README.md`](./README.md).
> Status legend: ✅ complete · 🟡 partial · ❌ stub/broken · 🔴 dead code (unused or references missing modules) · 🗑 deleted
>
> All paths are relative to `api/`. The live message path is now:
> `POST /api/v1/messages` → `src/feature/messages/controllers/create-messages.controler.ts` → saves user msg → loads history → `generateAssistantReply` (`src/service/rag-service/rag.answer.ts`): `buildRagContext` (Chroma `legal_questions`, degrades to empty) → `buildRagChatPrompt` (single composed prompt) → `generateTextContent` → saves AI msg with `metadata.sources`. The same `generateAssistantReply` answers the first message of a new chat (`create-chat.controller.ts`).

---

## 1. Current State (by stack layer)

### 1.1 Data layer (schemas / types)

| File | Status | Notes |
| --- | --- | --- |
| `src/feature/messages/messages.schema.ts` | ✅ | `chat_messages.metadata` jsonb is now written by `sendMessage` (persists RAG sources); `sender_type` enum supports user/assistant/system |
| `src/feature/messages/messages.types.ts` | ✅ | `messageInputSchema`/`MessageInput` includes optional `metadata?: Record<string, unknown>` |
| `src/service/embedding-service/embeddings.schema.ts` | ✅ | `document_chunks` + `embedding_jobs` written by the ingest pipeline (see [`ingestion.md`](./ingestion.md)); pgvector column/index commented out |
| `src/service/inference/inference.schema.ts` | 🟡 | `inference_providers`, `inference_models`, `user_inference_preferences` tables; used only by unwired preference controllers |
| `src/service/rag-service/rag.types.ts` | ✅ | `RAGChunk`, `RAGSource`, `RAGContext`, `RetrievalOptions`, `ConversationTurn`; `ragQuerySchema` (validates `{ query }` — callers pass it correctly now) |
| `src/service/embedding-service/embeddings.types.ts` | ✅ | `QueryEmbeddingOptions`, `DocumentChunk` |
| `src/feature/documents/documents.types.ts` | ✅ | `LegalDocumentChunk`, `DocumentIngestionEvent` (SSE progress), `DocumentJobMap` |

### 1.2 Operations / business logic layer

| File | Status | Notes |
| --- | --- | --- |
| `src/feature/messages/operations/messages.create.ts` | ✅ | `sendMessage` persists messages (incl. `metadata`), validates chat + user |
| `src/feature/messages/operations/messages.list.ts` | ✅ | `getMessagesByChatId` returns ordered history |
| `src/service/rag-service/rag.service.ts` | ✅ | `retrieveContext` — single `searchEmbedding` on `legal_questions`, threshold 0.7, maps Chroma → `{ chunks, sources }`, strips leading title, dedupes sources, empty arrays on no hits |
| `src/service/rag-service/rag.context.ts` | ✅ | `buildRagContext` — real context (degrade-to-empty on failure) + trimmed history (exclude current, last ~10) |
| `src/service/rag-service/rag.chunker.ts` | ✅ | Real `chunkDocument` (done via ingestion I2.1) |
| `src/service/rag-service/rag.prompts.ts` | ✅ | `buildRagChatPrompt(question, history, context)` — single composed prompt with `[Title, Section]` citations + no-context branch |
| `src/service/rag-service/rag.answer.ts` | ✅ | `generateAssistantReply` — shared answer path (context → prompt → LLM → persist assistant msg with `metadata.sources`); called by the messages controller and chat creation |
| `src/feature/chats/chat.prompts.ts` | 🟡 | `systemPrompt` (structured RELATED_DOCUMENTS/RELEVANT_LAWS) exported, never set on a client |
| `src/service/inference/inference.prompts.ts` | 🟡 | `chatSystemPrompt` + duplicate `generateResponsePrompt` |
| `src/service/embedding-service/embeddings.generate.ts` | ✅ | `generateDocumentEmbeddings` (batches, metadata incl. section/category/source) |
| `src/service/embedding-service/embeddings.search.ts` | ✅ | `searchEmbedding` — real Chroma query |
| `src/service/rag-service/rag.retrieval.ts`, `rag.answers.ts`, `rag.utils.ts`, `similarity-cosines.ts`, `re-ranker.ts` | 🗑 | Deleted (dead scaffolding; superseded by `retrieveContext`) |
| `src/service/embedding-service/embeddings.store.ts`, `generateTextEmbedding` | 🗑 | Deleted (misnamed — both were actually Chroma queries) |

### 1.3 HTTP layer

| File | Status | Notes |
| --- | --- | --- |
| `src/feature/messages/messages.routes.ts` | ✅ | `POST /v1/messages`, `GET /v1/messages/:chatId/all`; mounted behind auth in `src/routes/index.ts` |
| `src/feature/messages/controllers/create-messages.controler.ts` | ✅ | Live flow — save user msg → history → `generateAssistantReply` (context → prompt → LLM → save assistant msg with `metadata: { sources }`) → respond 201; best-effort (LLM failure is logged, user msg still saved) |
| `src/feature/messages/controllers/get-messages.controller.ts` | ✅ | Lists messages by chat (sources already surface via `metadata` in the serializer) |
| `src/service/inference/inference.routes.ts` | 🔴 | Preferences + discovery routes; **not mounted** in `src/routes/index.ts` |
| `src/feature/chats/controllers/create-chat.controller.ts` | ✅ | Creates chat + first message, then answers the first message via `generateAssistantReply` (best-effort — chat is created regardless of LLM failure) |
| `src/feature/chats/chats.routes.ts` | ✅ | Chat CRUD |

### 1.4 Background processing (jobs)

| File | Status | Notes |
| --- | --- | --- |
| `src/lib/bullmq/` | ✅ | `queueManager`, `createBullWorker`, queue names, retries/backoff |
| `src/lib/bullmq/bullmq.init.ts` | ✅ | Documents worker enabled; chat/message/inference workers still off |
| `src/feature/chats/jobs/` | 🔴 | `ChatCreated`/`MessageSent` handlers are `generateTextContent("Hello")` stubs; worker off **and** nothing enqueues these jobs anymore (orphaned — T4.3) |
| `src/feature/messages/jobs/` | 🔴 | `MessageSent` stub remains; queue constant fixed (`QueueName.Messages`), worker off **and** nothing enqueues it (orphaned — T4.3) |
| `src/feature/documents/jobs/` | ✅ | `DocumentUploaded` ingest pipeline real (see [`ingestion.md`](./ingestion.md)) |
| `src/service/inference/jobs/` | ❌ | `TextGeneration`/`DocumentAnalysis`/`EmbeddingGeneration` are TODO stubs; worker never registered |

### 1.5 Inference layer

| File | Status | Notes |
| --- | --- | --- |
| `src/service/inference/inference.orchestration.ts` | ✅ | `inferenceRouter.run` — call-time override > user pref > strategy default, fallback provider; compiles against `@/lib/llm` |
| `src/service/inference/inference.registry.ts` | ✅ | `InferenceStrategyRegistry` works |
| `src/service/inference/startegies/strategy.chat.ts` | ✅ | Chat strategy: prefers ollama, fallback gemini, model `gemma:b3`, builds history into prompt |
| `src/service/inference/inference.service.ts` | 🗑 | Deleted (legacy, broken) |
| `src/service/inference/operations/` | ✅ | Preference find/insert/update |
| `src/service/inference/controllers/` | 🟡 | Preference + discovery controllers (unused) |

### 1.6 RAG infra & data

| File | Status | Notes |
| --- | --- | --- |
| `src/lib/chroma/index.ts` | ✅ | `chromaClient` — Chroma CloudClient + Ollama `nomic-embed-text` embedder; add/query/peek/count |
| `src/lib/chroma/chroma.config.ts` | ✅ | `legal_questions` collection constant, `CATEGORY_MAP` |
| `src/service/rag-service/dataset/laws.dataset.ts` | ✅ | ~596 lines of Uganda laws (id/title/category/source/content) — imported by `chroma:import-laws` |
| `src/service/rag-service/dataset/questions.dataset.ts` | ✅ | 85 questions |
| `src/feature/documents/scripts/import-laws-to-chroma.ts` | ✅ | Self-invoking entry importing `laws.dataset.ts` → seeds `legal_questions` |
| `src/feature/lawyers/scripts/*` | 🗑 | Deleted (empty `laws` variant + duplicate retrieve script) |
| `package.json` `chroma:import-laws` / `chroma:search-laws` | ✅ | Repointed to the runnable documents scripts |
| Tests | 🟡 | Unit tests for `retrieveContext` + `buildRagChatPrompt` added; no controller/integration tests |

### 1.7 LLM layer

| File | Status | Notes |
| --- | --- | --- |
| `src/lib/llm/index.ts` | ✅ | `LLMProviderManager` — default ollama; Gemini registered only when `GEMINI_API_KEY` set; `getClient()` falls back to the first registered provider if the default isn't configured |
| `src/lib/llm/gemini/index.ts`, `src/lib/llm/ollama/index.ts` | ✅ | `generateTextContent` — single-turn (prompt composed by `buildRagChatPrompt`; no `setSystemPrompt` on the shared singleton) |
| `src/lib/llm/ollama/ollama.chat.ts` | ✅ | Fixed (imports `ollamaClient` + `Message` from existing modules) |
| `src/lib/llm/llm.registry.ts` | 🗑 | Never existed; nothing imports it — T5.1 not needed |
| `src/lib/llm/llm.config.ts`, `llms.types.ts`, `llm.utils.ts` | ✅ | Config, interfaces, helpers |

### 1.8 Frontend touchpoints

| File | Status | Notes |
| --- | --- | --- |
| `frontend/app/lib/api/chat.api.ts` + `feature/chats/hooks/use-chats.ts` + screens | ✅ | Sends via `POST /v1/messages`; response treated as `void` (messages refetched); sources available through `GET /v1/messages/:chatId/all` `metadata` |
| `frontend/app/lib/api/inference.api.ts` | 🟡 | Provider/strategy/preference discovery only; no run endpoint |

---

## 2. Backlog (by phase, one layer per phase)

> Order reflects the implementation sequence. Each phase is independently shippable and verifiable.

### Phase 1 — Data layer
- [x] **T1.1** Add optional `metadata?: Record<string, unknown>` to `messageInputSchema` / `MessageInput` and pass it through in `messages.create.ts` `sendMessage`.
- [x] **T1.2** Fix `ragQuerySchema` mismatch in `rag.service.ts` (parse `query`, not `queryString`).
- [x] **T1.3** Define a `RAGSource` type (id, title, category, source, section, similarity) and reconcile with `RAGContext.sources` / `SimilarityResult` (the old `SimilarityResult` types were deleted with the dead retrieval files).
- [x] **T1.4** (optional) Wire `document_chunks` / `embedding_jobs` tables into the ingest flow (done via ingestion Phase III).

### Phase 2 — Operations / business logic layer
- [x] **T2.1** Implement `rag.service.retrieveContext(question, opts)`: single `searchEmbedding` call on `legal_questions` (`topK`, `minSimilarity` 0.7), map Chroma response → `RAGContext { chunks, sources }`, empty arrays on no hits (never throw on empty).
- [x] **T2.2** Complete `rag.context.buildRagContext(userMessage, history)`: use `legal_questions`, return real context (degrade-to-empty on failure).
- [x] **T2.3** Add `buildRagChatPrompt(question, history, context)` in `rag.prompts.ts`: system instructions + context with `[Title, Section]` citations + trimmed history + question + explicit no-context branch.
- [x] **T2.4** History helper: reuse `getMessagesByChatId`, exclude current message, trim to last ~10.
- [x] **T2.5** (defer) Real `chunkDocument` done via ingestion I2.1; `reRank` / `measureLawSimilarity` were dead code — deleted with the legacy RAG files.

### Phase 3 — HTTP layer
- [x] **T3.1** Rewrite `sendMessageController`: save user msg → load history → `buildRagContext` (try/catch, degrade to empty context) → `buildRagChatPrompt` → `generateTextContent` → save assistant msg with `metadata: { sources }` → respond.
- [x] **T3.2** Decide response shape: keep `void` + refetch; sources surface via `GET /v1/messages/:chatId/all` `metadata` (no frontend schema change needed).
- [ ] **T3.3** (optional) Mount `inference.routes.ts` if the preferences/discovery API is wanted.

### Phase 4 — Background processing (jobs)
- [x] **T4.1** Un-comment workers selectively in `bullmq.init.ts` (start with ingest worker; keep chat/message/inference workers off until real handlers exist).
- [x] **T4.2** Fix `messages.worker.ts` wrong queue constant (`QueueName.Documents` → `QueueName.Messages`).
- [ ] **T4.3** Remove the orphaned chat/message jobs (nothing enqueues them since chat creation answers synchronously via `generateAssistantReply`) or repurpose them.
- [x] **T4.4** Fix `documents.jobs.ts` `@/services/...` → `@/service/...` imports so the ingest pipeline compiles; chunker is real.
- [ ] **T4.5** (future) Move inference to async (`inference.worker`) with SSE/polling for progress.

### Phase 5 — Inference layer
- [x] **T5.1** No longer needed — nothing imports `src/lib/llm/llm.registry.ts` (verified by grep); inference layer compiles against `@/lib/llm` directly.
- [ ] **T5.2** (future) Add a RAG hook to the chat strategy (retrieve before prompt) or keep RAG in the operations layer (Phase 2) and have the controller call it directly — **implemented via controller path**.
- [ ] **T5.3** (future) Route the message flow through `inferenceRouter.run("chat", ...)` to gain provider-preference resolution + fallback.

### Phase 6 — RAG retrieval & ingest
- [x] **T6.1** Fix `chroma:import-laws` npm script path and seed `legal_questions` from `laws.dataset.ts` (unblocks end-to-end verification).
- [x] **T6.2** Unit tests: `retrieveContext` mapping/filtering/threshold/empty; `buildRagChatPrompt` (context, history, no-context branch).
- [ ] **T6.3** Controller test (mocked chroma + LLM): user msg saved → prompt built → assistant msg saved with `metadata.sources`.
- [ ] **T6.4** (optional) Local Chroma via `infra/docker-compose.yml` for dev; confirm `nomic-embed-text` availability.
- [x] **T6.5** Deleted legacy `rag.retrieval.ts` / `rag.answers.ts` (plus `rag.utils.ts`, `similarity-cosines.ts`, `re-ranker.ts`, `embeddings.store.ts`, `generateTextEmbedding`, unused types) — superseded by `retrieveContext`.

### Phase 7 — Future / out of scope
- [ ] Streaming (SSE) responses for chat.
- [ ] Sources / related-documents UI in frontend (data persisted via T3.1).
- [ ] pgvector alternative to Chroma; semantic caching; eval harness.

---

## 3. Decisions & Constraints

- **Wiring approach**: synchronous `generateAssistantReply` in `rag.answer.ts`, called from `sendMessageController` and `createChatController` (not async jobs, not via `inferenceRouter.run`) — implemented. Smallest change, matches current UX.
- **Prompt**: single composed prompt via `buildRagChatPrompt` passed to `generateTextContent`; never `setSystemPrompt` (mutates the shared provider singleton).
- **Sources**: persisted in `chat_messages.metadata` (no migration needed — jsonb exists) and surfaced through `GET /v1/messages/:chatId/all`; response shape stays `void` + frontend refetch.
- **Dead code**: deleted (T6.5) rather than kept-and-fixed.
- **Chroma collection**: `legal_questions`; seeded via `npm run chroma:import-laws` (from `laws.dataset.ts`).
- **Verification**: `npm run typecheck` + `npm run lint` (root) + `npm run test` (api; rag unit tests live outside the `test:unit` glob, so run the full suite); frontend `npm run generate:types` not required (no schema change); manual check via Swagger with Chroma + Ollama configured.
