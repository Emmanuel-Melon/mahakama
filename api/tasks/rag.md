# RAG Pipeline — Current State & Backlog (Read-Path)

> Living plan for wiring the RAG layer into the message flow. This is the **read-path** of the RAG system; the write-path (document ingestion → Chroma) is covered in [`ingestion.md`](./ingestion.md). Entry point: [`README.md`](./README.md).
> Status legend: ✅ complete · 🟡 partial · ❌ stub/broken · 🔴 dead code (unused or references missing modules)
>
> All paths are relative to `api/`. A prior trace confirmed the live message path is:
> `POST /api/v1/messages` → `src/feature/messages/controllers/create-messages.controler.ts` → saves user msg → raw `llmProviderManager.getClient().generateTextContent(content)` (no history, no RAG) → saves AI msg.

---

## 1. Current State (by stack layer)

### 1.1 Data layer (schemas / types)

| File | Status | Notes |
| --- | --- | --- |
| `src/feature/messages/messages.schema.ts` | 🟡 | `chat_messages.metadata` jsonb exists but is never written; `sender_type` enum supports user/assistant/system |
| `src/feature/messages/messages.types.ts` | ❌ | `messageInputSchema`/`MessageInput` has no `metadata` field → cannot persist RAG sources |
| `src/service/embedding-service/embeddings.schema.ts` | 🟡 | `document_chunks` + `embedding_jobs` tables exist, unused; pgvector column/index commented out |
| `src/service/inference/inference.schema.ts` | 🟡 | `inference_providers`, `inference_models`, `user_inference_preferences` tables; used only by unwired preference controllers |
| `src/service/rag-service/rag.types.ts` | 🟡 | `RAGContext`, `RetrievalOptions`, `SimilarityResult`, `ChromaSimilarityResult` defined; `ragQuerySchema` expects field `query` but callers pass `queryString` |
| `src/service/embedding-service/embeddings.types.ts` | ✅ | `QueryEmbedding`, `QueryEmbeddingOptions`, `DocumentChunk`, `EmbeddingResult` |
| `src/feature/documents/documents.types.ts` | ✅ | `LegalDocumentChunk`, `DocumentIngestionEvent` (SSE progress), `DocumentJobMap` |

### 1.2 Operations / business logic layer

| File | Status | Notes |
| --- | --- | --- |
| `src/feature/messages/operations/messages.create.ts` | ✅ | `sendMessage` persists messages, validates chat + user; no metadata passthrough |
| `src/feature/messages/operations/messages.list.ts` | ✅ | `getMessagesByChatId` returns ordered history |
| `src/service/rag-service/rag.service.ts` | ❌ | `retrieveContext` stub — returns `{ chunks: [], sources: [] }`; duplicate query call; zod mismatch (`queryString` vs `query`) |
| `src/service/rag-service/rag.context.ts` | ❌ | `buildRagContext` returns `[]`; uses collection `"messages"` (should be `legal_questions`); never imported |
| `src/service/rag-service/rag.retrieval.ts` | 🟡 | `getVectorizedLaws` / `findRelevantDocuments` / `getMostRelevantDocument` — real implementation, orphaned; collection `legal_questions`, cosine threshold 0.7 |
| `src/service/rag-service/rag.answers.ts` | 🔴 | `answerRagQuestion` — depends on broken `ollama.chat`; unused |
| `src/service/rag-service/rag.chunker.ts` | ❌ | `chunkDocument` returns `[]` |
| `src/service/rag-service/rag.prompts.ts` | 🟡 | `generateResponsePrompt`, `buildPromptWithContext`, `buildSystemPrompt` usable; none include conversation history |
| `src/feature/chats/chat.prompts.ts` | 🟡 | `systemPrompt` (structured RELATED_DOCUMENTS/RELEVANT_LAWS) exported, never set on a client |
| `src/service/inference/inference.prompts.ts` | 🟡 | `chatSystemPrompt` + duplicate `generateResponsePrompt` |
| `src/service/embedding-service/embeddings.generate.ts` | 🟡 | `generateDocumentEmbeddings` ✅ real; `generateTextEmbedding` 🔴 misnamed (actually queries Chroma) |
| `src/service/embedding-service/embeddings.search.ts` | ✅ | `searchEmbedding` — real Chroma query |
| `src/service/embedding-service/embeddings.store.ts` | 🔴 | `storeEmbedding` misnamed (actually a query); unused |
| `src/service/rag-service/similarity-cosines.ts` | 🟡 | `measureLawSimilarity` dot-product; unused |
| `src/service/rag-service/re-ranker.ts` | ❌ | `reRank` passthrough stub |
| `src/service/rag-service/rag.utils.ts` | ✅ | `toSimilarityResult` mapper |

### 1.3 HTTP layer

| File | Status | Notes |
| --- | --- | --- |
| `src/feature/messages/messages.routes.ts` | ✅ | `POST /v1/messages`, `GET /v1/messages/:chatId/all`; mounted behind auth in `src/routes/index.ts` |
| `src/feature/messages/controllers/create-messages.controler.ts` | ❌ | Live flow — raw `generateTextContent(content)`, no history/context/sources; returns only the user message |
| `src/feature/messages/controllers/get-messages.controller.ts` | ✅ | Lists messages by chat |
| `src/service/inference/inference.routes.ts` | 🔴 | Preferences + discovery routes; **not mounted** in `src/routes/index.ts` |
| `src/feature/chats/controllers/create-chat.controller.ts` | 🟡 | Creates chat + first message; enqueues `ChatCreated` job that is never consumed |
| `src/feature/chats/chats.routes.ts` | ✅ | Chat CRUD |

### 1.4 Background processing (jobs)

| File | Status | Notes |
| --- | --- | --- |
| `src/lib/bullmq/` | ✅ | `queueManager`, `createBullWorker`, queue names, retries/backoff |
| `src/lib/bullmq/bullmq.init.ts` | ❌ | `initAllWorkers()` — every worker commented out (server.ts calls it) |
| `src/feature/chats/jobs/` | ❌ | `ChatCreated`/`MessageSent` handlers are stubs (`generateTextContent("Hello")`) |
| `src/feature/messages/jobs/` | ❌ | `MessageSent` stub; `messages.worker.ts` registers on wrong queue (`QueueName.Documents`) |
| `src/feature/documents/jobs/` | ❌ | `DocumentUploaded` ingest pipeline — broken `@/services/...` imports + `chunkDocument` stub |
| `src/service/inference/jobs/` | ❌ | `TextGeneration`/`DocumentAnalysis`/`EmbeddingGeneration` are TODO stubs; worker never registered |

### 1.5 Inference layer

| File | Status | Notes |
| --- | --- | --- |
| `src/service/inference/inference.orchestration.ts` | 🔴 | `inferenceRouter.run` — solid design (call-time override > user pref > strategy default, fallback provider) but imports missing `@/lib/llm/llm.registry` |
| `src/service/inference/inference.registry.ts` | ✅ | `InferenceStrategyRegistry` works |
| `src/service/inference/startegies/strategy.chat.ts` | ✅ | Chat strategy: prefers ollama, fallback gemini, model `gemma:b3`, builds history into prompt |
| `src/service/inference/inference.service.ts` | 🔴 | Legacy `InferenceService.generate` — missing registry + `gpt-4o` default |
| `src/service/inference/operations/` | ✅ | Preference find/insert/update |
| `src/service/inference/controllers/` | 🟡 | Preference + discovery controllers (unused) |

### 1.6 RAG infra & data

| File | Status | Notes |
| --- | --- | --- |
| `src/lib/chroma/index.ts` | ✅ | `chromaClient` — Chroma CloudClient + Ollama `nomic-embed-text` embedder; add/query/peek/count |
| `src/lib/chroma/chroma.config.ts` | ✅ | `legal_questions` collection constant, `CATEGORY_MAP` |
| `src/service/rag-service/dataset/laws.dataset.ts` | ✅ | ~596 lines of Uganda laws (id/title/category/source/content) — matches `LegalDocumentChunk`, imported nowhere |
| `src/service/rag-service/dataset/questions.dataset.ts` | ✅ | 85 questions |
| `src/feature/documents/scripts/import-laws-to-chroma.ts` | ❌ | `importLawsToChroma(laws)` defined but never invoked |
| `src/feature/lawyers/scripts/import-laws-to-chroma.ts` | ❌ | Runs, but `laws` array is empty |
| `package.json` `chroma:import-laws` | ❌ | Points to `scripts/import-laws-to-chroma.ts` (does not exist) |
| Tests | ❌ | No rag/embeddings/chroma tests |

### 1.7 LLM layer

| File | Status | Notes |
| --- | --- | --- |
| `src/lib/llm/index.ts` | ✅ | `LLMProviderManager` — default ollama; Gemini registered only when `GEMINI_API_KEY` set |
| `src/lib/llm/gemini/index.ts`, `src/lib/llm/ollama/index.ts` | ✅ | `generateTextContent` — single-turn, no history support |
| `src/lib/llm/ollama/ollama.chat.ts` | 🔴 | References non-existent `ollamaClient.getClient()` + `LLMMessage` import |
| `src/lib/llm/llm.registry.ts` | ❌ | **Missing** — imported by inference layer |
| `src/lib/llm/llm.config.ts`, `llms.types.ts`, `llm.utils.ts` | ✅ | Config, interfaces, helpers |

### 1.8 Frontend touchpoints

| File | Status | Notes |
| --- | --- | --- |
| `frontend/app/lib/api/chat.api.ts` + `feature/chats/hooks/use-chats.ts` + screens | ✅ | Sends via `POST /v1/messages`; response treated as `void` (messages refetched); sources not surfaced |
| `frontend/app/lib/api/inference.api.ts` | 🟡 | Provider/strategy/preference discovery only; no run endpoint |

---

## 2. Backlog (by phase, one layer per phase)

> Order reflects the implementation sequence. Each phase is independently shippable and verifiable.

### Phase 1 — Data layer
- [ ] **T1.1** Add optional `metadata?: Record<string, unknown>` to `messageInputSchema` / `MessageInput` and pass it through in `messages.create.ts` `sendMessage`.
- [ ] **T1.2** Fix `ragQuerySchema` mismatch in `rag.service.ts` (parse `query`, not `queryString`).
- [ ] **T1.3** Define a `RAGSource` type (id, title, category, source, section, similarity) and reconcile with `RAGContext.sources` / `SimilarityResult`.
- [ ] **T1.4** (optional) Wire `document_chunks` / `embedding_jobs` tables into the ingest flow (see Phase 4/6).

### Phase 2 — Operations / business logic layer
- [ ] **T2.1** Implement `rag.service.retrieveContext(question, opts)`: single `searchEmbedding` call on `legal_questions` (`topK`, `minSimilarity` 0.7), map Chroma response → `RAGContext { chunks, sources }`, empty arrays on no hits (never throw on empty).
- [ ] **T2.2** Complete `rag.context.buildRagContext(userMessage, history)`: use `legal_questions`, return real context.
- [ ] **T2.3** Add `buildRagChatPrompt(question, history, context)` in `rag.prompts.ts`: system instructions + context with `[Title, Section]` citations + trimmed history + question + explicit no-context branch.
- [ ] **T2.4** History helper: reuse `getMessagesByChatId`, exclude current message, trim to last ~10.
- [ ] **T2.5** (defer) Real `chunkDocument`, `reRank`, `measureLawSimilarity` (needed for ingest, not retrieval).

### Phase 3 — HTTP layer
- [ ] **T3.1** Rewrite `sendMessageController`: save user msg → load history → `buildRagContext` (try/catch, degrade to empty context) → `buildRagChatPrompt` → `generateTextContent` → save assistant msg with `metadata: { sources }` → respond.
- [ ] **T3.2** Decide response shape: expose sources in JSON:API attributes vs. keep `void` + refetch (affects frontend work in Phase 7).
- [ ] **T3.3** (optional) Mount `inference.routes.ts` if the preferences/discovery API is wanted.

### Phase 4 — Background processing (jobs)
- [ ] **T4.1** Un-comment workers selectively in `bullmq.init.ts` (start with ingest worker; keep chat/message/inference workers off until real handlers exist).
- [ ] **T4.2** Fix `messages.worker.ts` wrong queue constant (`QueueName.Documents` → `QueueName.Messages`).
- [ ] **T4.3** Replace chat/message job stubs with real handlers or remove the unused jobs.
- [ ] **T4.4** Fix `documents.jobs.ts` `@/services/...` → `@/service/...` imports so the ingest pipeline compiles; depends on T2.5 chunker.
- [ ] **T4.5** (future) Move inference to async (`inference.worker`) with SSE/polling for progress.

### Phase 5 — Inference layer
- [ ] **T5.1** Create minimal `src/lib/llm/llm.registry.ts` shim (`ModelRegistry`, `LLMProviderRegistry` with `.get(name)` → `llmProviderManager.getClient(name)`, `InputRegistry`, `OutputRegistry`) typed loosely enough for `inference.service.ts` + `inference.orchestration.ts` to compile.
- [ ] **T5.2** (future) Add a RAG hook to the chat strategy (retrieve before prompt) or keep RAG in the operations layer (Phase 2) and have the controller call it directly.
- [ ] **T5.3** (future) Route the message flow through `inferenceRouter.run("chat", ...)` to gain provider-preference resolution + fallback.

### Phase 6 — RAG retrieval & ingest
- [ ] **T6.1** Fix `chroma:import-laws` npm script path and seed `legal_questions` from `laws.dataset.ts` (unblocks end-to-end verification).
- [ ] **T6.2** Unit tests: `retrieveContext` mapping/filtering/threshold/empty; `buildRagChatPrompt` (context, history, no-context branch).
- [ ] **T6.3** Controller test (mocked chroma + LLM): user msg saved → prompt built → assistant msg saved with `metadata.sources`.
- [ ] **T6.4** (optional) Local Chroma via `infra/docker-compose.yml` for dev; confirm `nomic-embed-text` availability.
- [ ] **T6.5** (optional) Consolidate or delete legacy `rag.retrieval.ts` / `rag.answers.ts` once `retrieveContext` supersedes them.

### Phase 7 — Future / out of scope
- [ ] Streaming (SSE) responses for chat.
- [ ] Sources / related-documents UI in frontend (data persisted via T3.1).
- [ ] pgvector alternative to Chroma; semantic caching; eval harness.

---

## 3. Decisions & Constraints

- **Wiring approach**: synchronous in `sendMessageController` (not async jobs, not via `inferenceRouter.run`) for now — smallest change, matches current UX.
- **Broken scaffolding**: keep files; apply minimal fixes to unblock `tsc` (T5.1 shim, `@/services` path fixes) rather than deleting.
- **Chroma collection**: `legal_questions` assumed pre-populated for retrieval work; seeding is Phase 6 (T6.1).
- **Sources**: persisted in `chat_messages.metadata` to enable the source-verification UX later.
- **Verification**: `npm run typecheck` + `npm run lint` + `npm run test:unit` (api); manual check via Swagger with Chroma + Ollama configured.
