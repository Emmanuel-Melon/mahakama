# Mahakama — Technical Deep-Dive

> Mahakama (Swahili/Arabic for "Court") is an AI-powered legal empowerment platform for citizens in South Sudan and Uganda. It delivers plain-language answers to real-life legal questions, grounding every response in verified legal statutes, and connects users with lawyers and legal services.

This document describes my contributions to the project, the architecture, the technologies involved, and the hardest problems I solved.

---

## What I Built

I built the entire Mahakama platform from scratch. This includes:

- **Backend API** — An Express 5 + TypeScript server organized with Domain-Driven Design. Nine domain modules (`auth`, `chats`, `documents`, `inference`, `lawyers`, `messages`, `notifications`, `services`, `users`) each with controllers, operations, routes, Zod schemas, and Drizzle ORM table definitions. Cross-domain services for RAG, embeddings, search, law-source tracking, and inference orchestration. Background job processing via BullMQ with typed job maps. OpenAPI documentation via Swagger. Full middleware stack (JWT auth, CORS, error handling, request logging, file uploads).

- **RAG Pipeline** — A complete Retrieval-Augmented Generation system with a write-path (document ingestion into vector stores) and a read-path (query embedding, similarity search, prompt assembly, LLM generation with streaming, post-generation citation validation, and staleness detection). Dual vector store support (ChromaDB Cloud + pgvector) with zero-downtime migration via a composite store pattern.

- **Frontend Application** — A React Router 7 (framework mode, SSR) application with Vite, Tailwind CSS v4, and shadcn/ui. Eight feature domains: auth, chats, documents, lawyers, notifications, search, users, and a public website. Centralized routing (not file-based), i18n with English and Arabic locales, SSE streaming for real-time AI responses, a citations sidebar, multi-step onboarding, and a neobrutalist-inspired design system.

- **Shared Packages** — `@mah/api` (typed HTTP clients, react-query hooks, generated OpenAPI types, route constants) and `@mah/client` (shared react-query utilities), extracted to support the frontend and enable future consumers.

- **Infrastructure** — Docker Compose for local development (Postgres 16, Redis 7, Ollama), Dockerfiles for production (multi-stage builds), Railway deployment for the API, Netlify for the frontend, GitHub Actions CI with unit and integration test jobs, and Turborepo for monorepo orchestration.

- **360 commits** across 27+ feature branches (`MAH-1` through `MAH-27`), all linked to GitHub Issues, developed over 10 months (October 2025 to August 2026).

---

## My Role in the Architecture

I was the sole architect and implementer. Every architectural decision in this codebase is mine:

- **DDD domain modules** — I chose to organize the backend by domain rather than by layer, with each feature owning its schemas, controllers, operations, routes, types, and jobs. Shared infrastructure lives in `src/lib/`, cross-domain orchestration in `src/service/`.

- **Composite vector store** — I designed the primary + shadow store pattern to enable zero-downtime migration between ChromaDB and pgvector. Writes go to both stores; reads go to primary only. This was a deliberate trade-off: eventual consistency during migration in exchange for zero-downtime cutover.

- **SSE streaming through BullMQ** — I chose server-sent events over WebSockets for the AI response stream. The HTTP controller opens the SSE connection, subscribes to an in-process EventEmitter, enqueues a BullMQ job, and the worker publishes tokens back through the emitter. This keeps the job queue decoupled from the HTTP transport.

- **Provider-based LLM abstraction** — A `LLMProviderManager` registry pattern where each provider implements `ILLMProvider`. The manager holds a `Map<string, Provider>` and routes requests by name with automatic fallback if the default provider is unavailable.

- **Centralized frontend routing** — I rejected file-based routing in favor of explicit route declarations in `app/routes.ts`, pulling config objects from per-feature `*Config.ts` files. This gives full control over route ordering, layout assignment, and preload strategies.

- **Shared API package** — I extracted `@mah/api` from the frontend to decouple API clients and hooks from the UI layer, enabling reuse and independent testing.

---

## Parts I Implemented

Every file in this repository. Key modules I'm most proud of:

**Backend core:**

- `src/app.ts`, `src/server.ts` — Express 5 app creation and startup
- `src/config/index.ts` + `config.types.ts` — Zod-validated environment configuration with 50+ variables across server, database, LLM, storage, embedding, RAG, and law-source categories
- `src/middleware/` — JWT authentication (`authenticateToken`, `methodBasedAuth`), CORS, error handling, request logging, file upload (multer), request metadata extraction
- `src/routes/index.ts` — Master router mounting all 9 domain routers under `/api/v1`

**RAG pipeline (`src/service/rag-service/`):**

- `rag.service.ts` — Core retrieval: embed query via Ollama, cosine similarity search against vector store, threshold filtering (0.7), staleness detection, source deduplication
- `rag.chunker.ts` — Section-aware chunker with regex-based legal header detection, preamble handling, word-boundary-aware splitting, and cross-section boundary guarantees
- `rag.prompts.ts` — Prompt assembly with strict grounding rules, citation formatting, no-context branch, staleness warnings, and anti-fabrication instructions
- `rag.citations.ts` — Post-generation citation extraction (5 regex patterns for Ugandan legal references) and fabrication detection via whitelist cross-check
- `rag.staleness.ts` — Version-based and age-based staleness checks with fail-open policy
- `rag.context.ts` — Error-resilient context builder that degrades to empty context on failure
- `rag.answer.ts` — Streaming LLM generation with token-by-token SSE relay

**Embedding service (`src/service/embedding-service/`):**

- `embeddings.factory.ts` — Factory wiring provider + store based on config (`EMBEDDING_WRITE_MODE`, `EMBEDDING_PRIMARY_STORE`)
- `stores/index.ts` — Composite store: primary + optional shadow, write-both/read-primary
- `stores/chroma.store.ts` — ChromaDB CloudClient adapter
- `stores/pgvector.store.ts` — pgvector adapter using Drizzle ORM with `cosineDistance` operator and HNSW index
- `providers/ollama.provider.ts` — Ollama embedding provider with client-side batching
- `operations/embeddings.insert.ts` — Batch embedding generation (20 chunks/batch) with retry-safe verification
- `embeddings.schema.ts` — `document_chunks` table with pgvector column and HNSW index, `embedding_jobs` tracking table

**Document ingestion (`src/feature/documents/`):**

- `operations/documents.ingest.ts` — Full pipeline: PDF parse, chunk, enrich, persist, embed, store, cleanup old versions
- `controllers/ingest-document.controller.ts` — File upload with SSE progress streaming
- `jobs/documents.worker.ts` + `documents.jobs.ts` — BullMQ worker with retry logic and terminal failure handling

**LLM integration (`src/lib/llm/`):**

- `index.ts` — `LLMProviderManager` with provider registry, fallback, and singleton export
- `gemini/index.ts` — Google Gemini client via `@google/genai` with streaming and structured output
- `ollama/index.ts` — Ollama client with singleton pattern, streaming, and title generation

**Background jobs (`src/lib/bullmq/`):**

- `index.ts` — `QueueManager` singleton, `createBullWorker` factory, worker registry
- `bullmq.init.ts` — Worker initialization (documents, chats, law sources active; auth, lawyers, messages disabled)
- `bullmq.config.ts` — Queue names, retry config (3 attempts, exponential backoff), worker concurrency (5)

**Frontend (`apps/frontend/app/`):**

- `routes.ts` — Centralized route declaration with `toRouteConfig()` helper
- `feature/chats/` — 26 components including `MessageBubble` (markdown + citation chips), `CitationsSidebar`, `ChatInput` (SSE streaming), `ChatForm` (file upload + progress)
- `feature/auth/` — Login, signup, forgot password, auth middleware (JWT decode on SSR)
- `feature/documents/` — Legal database with grid/list views, document details, upload with SSE progress
- `feature/users/` — Profile, settings, multi-step onboarding (role selection, basic info, professional info for lawyers, enhancements)
- `feature/www/` — Landing page, about, contact, legal services hub
- `layouts/` — `AppShell` (authenticated), `AuthLayout`, `WebsiteLayout`

**Shared API package (`packages/api/src/`):**

- `fetch.ts` — `FetchApiClient` with cookie-based auth, JSON:API error handling, typed requests
- `clients/chat.api.ts` — Chat client with manual SSE streaming implementation (`ReadableStream` + `parseSSEBlock`)
- `hooks/use-chats.ts` — Most complex hook: `useSendMessageStream` with SSE state machine (`idle -> streaming -> completed/error`), smart polling for pending replies
- `generated/api.types.ts` + `api.schemas.ts` — Auto-generated from OpenAPI spec

**Infrastructure:**

- `infra/docker-compose.yml` — Full local stack (Postgres, Redis, Ollama, API, Frontend)
- `infra/Dockerfile.api` — Multi-stage build with native module support
- `.github/workflows/api.yml` — CI with unit and integration tests using service containers

---

## AI/LLM Technologies

The following AI and LLM technologies are involved in Mahakama:

| Technology                        | Role                                   | Configuration                                                                        |
| --------------------------------- | -------------------------------------- | ------------------------------------------------------------------------------------ |
| **Ollama** `nomic-embed-text`     | Vector embeddings (768 dimensions)     | Local server at `localhost:11434`, called via `POST /api/embeddings`                 |
| **Ollama** `gemma3:1b`            | Local LLM for text generation          | Default provider, used for chat responses and title generation                       |
| **Google Gemini** 2.5 Flash / Pro | Cloud LLM for text generation          | Fallback provider via `@google/genai`, supports streaming and structured output      |
| **ChromaDB Cloud**                | Vector similarity search               | `CloudClient` with `CHROMA_API_KEY`, `CHROMA_TENANT`, `CHROMA_DATABASE`              |
| **pgvector**                      | Alternative vector store               | PostgreSQL extension with HNSW index (`vector_cosine_ops`), cosine distance operator |
| **Drizzle ORM**                   | Database access + pgvector integration | Type-safe queries, migration generation, schema-to-types pipeline                    |
| **BullMQ**                        | Async job processing                   | Redis-backed, typed job maps, exponential backoff retry                              |
| **js-tiktoken**                   | Token counting                         | gpt-4o BPE encoding for chunk token counts                                           |
| **Zod v4**                        | Schema validation                      | Request validation, config validation, API type generation                           |
| **OpenAPI / Swagger**             | API documentation                      | Auto-generated from Zod schemas via `@asteasolutions/zod-to-openapi`                 |
| **React Query**                   | Client-side data fetching              | Cache management, polling, optimistic updates, streaming state machines              |

The embedding pipeline uses Ollama's `nomic-embed-text` model exclusively — both for document chunk embedding during ingestion and query embedding during retrieval. This ensures embedding space consistency across write and read paths.

The LLM generation layer supports provider switching at runtime. The `LLMProviderManager` defaults to Ollama (`gemma3:1b`) for local development and falls back to Gemini (`gemini-2.5-flash`) when Ollama is unavailable. The inference orchestration service adds another layer: call-time overrides, user preferences, and strategy-based defaults with automatic provider fallback.

---

## Deployment Architecture

### Production

**API (Railway):**

- URL: `mahakama-api-production.up.railway.app`
- Docker multi-stage build: `node:22-alpine` builder with `g++ make python3` (for native modules like `bcryptjs`), lean production image running `node dist/src/server.js`
- Environment variables injected via Railway dashboard
- Connected to external Postgres, Redis (Upstash), ChromaDB Cloud, and Ollama instances

**Frontend (Netlify):**

- URL: `mahakama.netlify.app`
- React Router 7 SSR with `@vercel/react-router` build preset
- Vite production build served via Netlify's edge network
- API base URL configurable via `VITE_API_BASE_URL`

### Local Development (Docker Compose)

```
infra/docker-compose.yml
├── PostgreSQL 16 (Alpine) — port 5432, persistent volume, health checks
├── Redis 7 (Alpine) — port 6379
├── Ollama — port 11434, persistent volume, pull nomic-embed-text + gemma3:1b
├── API — port 3000, depends on Postgres (healthy), Redis, Ollama
└── Frontend — port 80, depends on API
```

### CI/CD (GitHub Actions)

**API pipeline** (`.github/workflows/api.yml`):

1. Checkout, setup Node.js (v24.16.0), `npm ci`
2. `npm run test:unit` — Vitest unit tests (operations only, no external deps)
3. `npm run test:integration` — Vitest integration tests with `postgres:16` + `redis:7` service containers, Drizzle migrations, controller tests

**Frontend pipeline** (`.github/workflows/frontend.yml`):

1. Checkout, setup Node.js, `npm ci`
2. Build

---

## The Hardest Technical Problems

### Problem 1: Dual Vector Store with Zero-Downtime Migration

**The problem:** I needed to migrate the vector store from ChromaDB Cloud to pgvector (PostgreSQL) without taking the system offline. During migration, both reads and writes had to work correctly. A naive approach — stop writes, backfill, switch reads — would cause downtime and data inconsistency.

**The solution:** I designed a composite store pattern with a primary and optional shadow store.

The core abstraction is in `src/service/embedding-service/stores/index.ts`. The `CompositeVectorStore` wraps a primary store and an optional shadow store. On write, it sends to both stores in parallel — if the shadow write fails, it logs the error but does not throw. On read, it goes to primary only. This means:

- During migration, I set the primary to Chroma and the shadow to pgvector. New writes go to both. Reads stay on Chroma.
- Once the shadow catches up (verified by a backfill script in `embeddings.backfill-pgvector.ts`), I flip `EMBEDDING_PRIMARY_STORE` to `pgvector`. Reads switch instantly. No data loss, no downtime.
- After confirming stability, I remove the shadow. The migration is complete.

The pgvector store had a subtle constraint I had to work around: `addDocuments` updates existing rows rather than inserting new ones. This is because the document metadata rows are created first in `saveDocumentChunks` (step 4 of ingestion), and the embedding column is filled in separately during step 6. The pgvector store's `addDocuments` method uses Drizzle's `update().set({ embedding })` with a `WHERE id = :id` clause, not an insert. This means the vector store depends on the metadata store — they can't be independent.

The factory in `embeddings.factory.ts` wires this all together:

```typescript
// writeMode: "dual", primaryStore: "chroma"
// -> Primary: Chroma, Shadow: pgvector
// Reads from Chroma, writes to both
```

The configuration is driven by two env vars: `EMBEDDING_WRITE_MODE` (`"chroma"` | `"pgvector"` | `"dual"`) and `EMBEDDING_PRIMARY_STORE` (`"chroma"` | `"pgvector"`). The factory always wraps the result in a composite store for a consistent interface.

The hardest part of this was reasoning about failure modes. What if Chroma write succeeds but pgvector fails? (Shadow failure is logged, not thrown — the read-primary is still consistent.) What if pgvector write succeeds but Chroma fails? (The primary write failing is a real error — the job retries.) What if both fail? (The job retries with exponential backoff, and the idempotent `saveDocumentChunks` ensures no duplicate metadata rows.) I had to think through every combination and make sure the system converged to a consistent state regardless of which store failed.

The HNSW index on pgvector (`vector_cosine_ops`) required a Drizzle schema change and migration. The dimension constant (768) is hardcoded in `embeddings.config.ts` because Drizzle requires a compile-time literal for the `vector(768)` column type — changing it requires a database migration, not just an env var flip. This is an intentional constraint documented in the codebase.

### Problem 2: Citation Validation and Fabrication Detection

**The problem:** Large language models hallucinate citations. In a legal context, this is dangerous — a user might rely on a fabricated law or section number. I needed a system that detects fabricated citations after generation, without blocking the response (since the user might still benefit from the answer even if citations are imperfect).

**The solution:** A post-generation citation validation pipeline in `src/service/rag-service/rag.citations.ts`.

After the LLM generates an answer, the system runs `extractCitations` against the full response text. This function applies five regex patterns tuned for Ugandan legal references:

1. Act names with years: `"Landlord and Tenant Act 2022"` or `"The Land Act, 2012"`
2. Article references: `"Article 20"` or `"Article 20(1)(a)"`
3. Section references: `"Section 26"` or `"Section 26(3)"`
4. Short-form section references: `"s. 26"` or `"s.26"`
5. Whole-instrument references: `"Constitution of Uganda"`

Each extracted citation is normalized (whitespace collapsed, case-insensitive) and deduplicated.

Then `filterCitationsAgainstWhitelist` cross-checks each citation against a whitelist built from the `fullCitation` values of the retrieved chunks. The matching is intentionally fuzzy: `"Section 26"` passes if `"Landlord and Tenant Act 2022, Section 26"` was in the retrieved context. This is implemented by checking whether any whitelist entry contains the extracted citation (case-insensitive substring match).

Citations not found in the whitelist are flagged as `fabricated`. This metadata is stored with the assistant message but does not block the response from reaching the user. The rationale: the answer might still be useful, and blocking it would degrade the user experience. Instead, the metadata enables downstream analysis (e.g., tracking fabrication rates over time, identifying which legal topics trigger the most hallucinations).

The system also tracks `citationStatus` at the message level:

- `"ok"` — all extracted citations are in the whitelist
- `"missing"` — no citations were extracted (the LLM didn't cite anything)

This feeds into the frontend's `CitationsSidebar`, which shows the source chunks with similarity scores and lets users verify the citations themselves.

The five regex patterns were iteratively refined. Early versions missed short-form references (`s. 26`) and the Constitution of Uganda references. The final patterns also handle edge cases like missing commas between act name and year, optional "The" prefix, and parenthetical subsection references.

The design decision to make this advisory-only (not blocking) was deliberate. I considered a stricter approach where fabricated citations would trigger a regeneration attempt, but this added latency and complexity without guaranteeing improvement — the LLM might fabricate different citations on the second attempt. The current approach surfaces the information transparently and lets the system evolve toward stricter validation as the citation patterns improve.

---

## RAG Pipeline Architecture

The RAG pipeline has two complementary paths:

### Write-Path (Ingestion)

```
PDF Upload → Parse Text → Section-Aware Chunk → Enrich Metadata →
Persist to Postgres → Generate Embeddings (Ollama) → Store Vectors →
Cleanup Old Versions
```

1. **Upload**: `POST /v1/documents/ingest` accepts a PDF (max 25MB). Multer processes the upload. The controller saves to disk, creates a `documents` row, opens an SSE stream, and enqueues a `DocumentUploaded` BullMQ job.

2. **PDF Parsing**: `parsePdfFromPath` (local) or `parsePdfFromUrl` (remote) extracts raw text via the `pdf-parse` library.

3. **Section-Aware Chunking** (`rag.chunker.ts`): First attempts to split on legal section headers via regex (`/^\s*(\d{1,3})\.\s+([A-Z][^\n]+)\n/gm`). If headers are found, preamble text is split separately, short sections stay whole, and long sections are sub-split with each sub-chunk retaining the section header. Falls back to character-based splitting with a sliding window (1000-char chunks, 200-char overlap, 20% word-boundary tolerance).

4. **Metadata Enrichment**: Each chunk gets version, documentId, actName, fullCitation (deterministic: `"ActName, Section N"`), jurisdiction, URL, and lastUpdated.

5. **Postgres Persistence**: `saveDocumentChunks` writes to `document_chunks` (idempotent delete-then-insert). Embedding column is NULL at this stage.

6. **Embedding Generation**: Batches of 20 chunks. Text format: `"{title}. {content}"`. Ollama `nomic-embed-text` produces 768-dimensional vectors. IDs are prefixed: `law_{chunkId}-v{version}`.

7. **Vector Storage**: Routes through composite store to configured backend. After each batch, verifies by reading back stored IDs (retry-safe).

8. **Old Version Cleanup**: For version > 1, deletes previous version's chunks from Chroma via metadata filter.

### Read-Path (Retrieval & Generation)

```
User Question → Embed Query → Vector Similarity Search → Filter by Threshold →
Staleness Check → Build Prompt → LLM Generate (Streaming) →
Validate Citations → Persist Message
```

1. **Query Embedding**: The user's question is embedded using the same `nomic-embed-text` model.

2. **Vector Search**: Cosine similarity search against the primary vector store. Top-K=5 results.

3. **Threshold Filtering**: Results below 0.7 similarity are discarded.

4. **Staleness Detection**: Each chunk's version is compared to the document's current version in Postgres. Chunks with `lastUpdated` older than 24 months are also flagged.

5. **Prompt Assembly** (`rag.prompts.ts`): Constructs a single prompt with system instructions (Mahakama identity, strict grounding, no fabrication), retrieved legal context with citations, conversation history (last 10 turns), staleness warnings, and the user's question.

6. **Streaming Generation**: The LLM generates tokens one at a time. Each token is published as a `Token` event through an in-process EventEmitter, relayed to the HTTP client as SSE.

7. **Citation Validation**: Post-generation, the answer is scanned against 5 regex patterns. Extracted citations are cross-checked against a whitelist from retrieved chunks. Fabricated citations are flagged in metadata.

8. **Persistence**: The full assistant message is saved with metadata: citation status, extracted citations, whitelist, fabricated citations, stale source flags, and source list.

---

## Ingestion Pipeline

The ingestion pipeline in `src/feature/documents/operations/documents.ingest.ts` is the `processDocumentPipeline` function. It accepts a document ID and chunking options.

### Section-Aware Chunking Algorithm

The chunker (`rag.chunker.ts`) implements a two-phase approach:

**Phase 1 — Section Detection**: `splitIntoSections()` uses regex to find legal section headers at line starts. It splits the text into `Section[]` objects with `section` number, `title`, and `content`.

**Phase 2a — Section-Aware Splitting** (when sections are found):

- Preamble text (before the first header) is split using character-based splitting with no section stamp.
- Short sections (body <= 1000 chars) stay whole.
- Long sections are sub-split within the section body. Each sub-chunk retains the section header prepended for context. The sliding window never crosses section boundaries.

**Phase 2b — Fallback Character-Based Splitting** (no headers found):

- Advances by chunk size, backs up to nearest word boundary within 20% tolerance.
- Overlap: 200 characters.
- Guaranteed forward progress to prevent infinite loops.

### Batch Embedding

Embeddings are generated in batches of 20. For each batch:

1. Concatenate `"{title}. {content}"` for each chunk
2. Call Ollama `POST /api/embeddings` (client-side batching via `Promise.all`)
3. Build `VectorRecord` objects with prefixed IDs and full metadata
4. Write to vector store
5. Verify by reading back stored IDs
6. Publish SSE progress events (`content` with chunk preview, `progress` with percentage)

### Version Management

When a document is re-ingested (e.g., after a law amendment), its `version` field is bumped. The pipeline embeds with version-scoped IDs (`law_{chunkId}-v{version}`) and deletes the previous version's chunks from Chroma. This ensures the vector store only contains current-version chunks while the Postgres `document_chunks` table retains historical versions for audit.

### Scheduled Law Source Updates

The law-sources service (`src/service/law-sources/`) runs a monthly cron job that:

1. Fetches "Last Updated" dates from external sources (ULII API, HTML scraping)
2. Compares against stored dates in `law_source_checks`
3. For detected changes: bumps document version, updates `lastUpdated`, enqueues a re-ingestion job
4. Records every check in the audit trail

This creates a closed loop: external law changes are detected, documents are re-ingested with new versions, old chunks are cleaned from the vector store, and staleness detection at retrieval time flags any remaining outdated chunks.

---

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend                              │
│  React Router 7 (SSR) + Vite + Tailwind v4 + shadcn/ui     │
│  8 feature domains, centralized routing, i18n (EN/AR)       │
│  SSE streaming, citations sidebar, smart polling            │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP + SSE
                           │ @mah/api (typed clients + hooks)
┌──────────────────────────┴──────────────────────────────────┐
│                      API (Express 5)                         │
│  9 DDD domain modules + 4 cross-domain services             │
│  JWT auth, Zod validation, OpenAPI docs                     │
│  BullMQ job queues (Redis), SSE streaming                   │
└──────┬──────────┬──────────┬──────────┬────────────────────┘
       │          │          │          │
┌──────┴──┐ ┌────┴────┐ ┌───┴───┐ ┌───┴────────────┐
│Postgres │ │ Redis   │ │Chroma │ │ Ollama          │
│16 +     │ │ (BullMQ │ │ Cloud │ │ nomic-embed     │
│pgvector │ │  queues)│ │       │ │ gemma3:1b       │
└─────────┘ └─────────┘ └───────┘ └────────────────┘
```

**Data flow for a user question:**

1. Frontend sends `POST /v1/messages` via `FetchApiClient`
2. Controller saves user message, opens SSE stream, enqueues `MessageSent` job
3. BullMQ worker picks up job, loads conversation history
4. `RAGService.retrieveContext` embeds query, searches vector store, filters by similarity, checks staleness
5. `buildRagChatPrompt` assembles grounded prompt with context + history + question
6. LLM generates tokens (Ollama or Gemini), each published as SSE `Token` event
7. Frontend renders tokens in real-time via `useSendMessageStream` hook
8. After generation, `extractCitations` validates citations against whitelist
9. Full assistant message saved with metadata (sources, citations, staleness flags)

**Data flow for document ingestion:**

1. Frontend uploads PDF via `useUploadDocument` hook with progress tracking
2. Controller saves file, creates document row, opens SSE stream, enqueues `DocumentUploaded` job
3. Worker calls `processDocumentPipeline`: parse PDF, section-aware chunk, enrich metadata, persist to Postgres, generate embeddings (batches of 20), store in vector DB, cleanup old versions
4. SSE events stream back: `started` -> `progress`/`content` (per batch) -> `completed`
5. Frontend shows real-time progress with chunk previews and percentage

---

_Emmanuel Gatwech — 2025-2026_
