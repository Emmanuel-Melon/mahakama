# RAG System — Plan Entry Point

> Living plan for the Mahakama RAG system. Split across two docs by data direction.
>
> Status legend: ✅ complete · 🟡 partial · ❌ stub/broken · 🔴 dead code (unused or references missing modules)
>
> All paths are relative to `api/`.

---

## System overview

```
                        WRITE-PATH (ingestion.md)                    READ-PATH (rag.md)
                        ────────────────────────                      ──────────────────────
 Upload ──▶ uploads/ ──▶ documents row ──▶ BullMQ ──▶ PDF parse          POST /v1/messages
 (multer)   (local)      (metadata)        job         │                    │
                                                       ▼                    │
                                                       chunk                ├──▶ retrieveContext
                                                       │                    │        (searchEmbedding)
                                                       ▼                    ▼
                                                   embed ──────▶  Chroma  ◀── embedding
                                                                 (legal_questions)
                                                                       │
                                                                       ▼
                                                                  context ──▶ prompt ──▶ LLM ──▶ response + sources
```

- **Write-path** (`ingestion.md`): turning an uploaded document into vectorized chunks in Chroma.
- **Read-path** (`rag.md`): turning a chat message into a context-grounded LLM answer using those chunks.

Both paths target the same Chroma collection, `legal_questions`, embedded with Ollama `nomic-embed-text`.

---

## Docs

| Doc                                            | Direction              | Scope                                                                                                                                                          |
| ---------------------------------------------- | ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`ingestion.md`](./ingestion.md)               | Write-path             | Upload → storage → document record → background job → PDF parse → chunk → embed → Chroma. Current state + backlog (Phases I–VI).                               |
| [`rag.md`](./rag.md)                           | Read-path              | Chat message → history + context retrieval → prompt → LLM → response with sources. Current state + backlog (Phases 1–7).                                       |
| [`citations.md`](./citations.md)               | Read-path              | Citation metadata model, retrieval returning `full_citation`/`url`, post-generation citation validation, Sources UI. Current state + backlog (Phases 1–5).     |
| [`metadata-updates.md`](./metadata-updates.md) | Write-path / lifecycle | Versioned chunks, real `last_updated`, monthly law-source diff checks, outdated-answer flagging, AKN amendment tracking. Current state + backlog (Phases 1–5). |

---

## Status at a glance

Both paths are currently **non-functional** — the RAG layer is built in pieces but not wired end-to-end.

- **Write-path**: upload stores the file + metadata row and enqueues a `DocumentUploaded` job that never runs (workers commented out). Even if it ran, `chunkDocument` is a stub returning `[]`, and `documents.jobs.ts` has broken `@/services/...` imports. Nothing reaches Chroma.
- **Read-path**: the live message controller calls the LLM directly with no history/context. The RAG retrieval pieces exist (`rag.retrieval.ts`, `embeddings.search.ts`) but `rag.service.retrieveContext` is a stub, the inference layer references a missing module, and no sources are persisted.

High-level roadmap: Data layer → Operations → HTTP → Background jobs → Inference → RAG retrieval & ingest → Future (streaming, sources UI).

---

## Shared dependencies

| Dependency                                           | Purpose                               | Notes                                                                            |
| ---------------------------------------------------- | ------------------------------------- | -------------------------------------------------------------------------------- |
| ChromaDB (Cloud) — collection `legal_questions`      | Vector store for both paths           | Config in `src/lib/chroma/chroma.config.ts`; client in `src/lib/chroma/index.ts` |
| Ollama — `nomic-embed-text`                          | Embedding model                       | `src/lib/chroma/index.ts`; relevance threshold 0.7                               |
| BullMQ + Redis                                       | Background jobs (ingest)              | Workers all disabled in `src/lib/bullmq/bullmq.init.ts`                          |
| Local filesystem — `uploads/` (served at `/uploads`) | Uploaded file storage                 | `src/lib/storage/storage.ts` + `samples.ts`; see [`storage.md`](./storage.md)    |
| `src/service/rag-service/dataset/laws.dataset.ts`    | Curated Uganda-laws seed (~596 lines) | Imported nowhere yet; needed to pre-populate `legal_questions`                   |

---

## Verification

- `npm run typecheck` + `npm run lint` + `npm run test:unit` (api).
- Manual: seed Chroma (`chroma:import-laws` once fixed), then upload a document via Swagger `POST /v1/documents/ingest` and confirm the job processes; send a chat message and confirm `metadata.sources` is populated.
