# Config Refactor Changelog

This document records the config and service refactoring performed on the embedding and RAG services, explaining what was broken, why, and what was changed.

## Problems Identified

### 1. Schema/Config Key Mismatch — Env Vars Silently Ignored

The `embeddingConfigSchema` in `config.types.ts` defined fields in UPPER_CASE (`MODEL`, `DIMENSIONS`, `OLLAMA_BASE_URL`), but the `embeddingConfigSchema.parse()` call in `config/index.ts` passed camelCase keys (`model`, `dimensions`, `ollamaBaseUrl`). Because every field had a Zod `.default()`, the mismatched keys were silently ignored — Zod applied the defaults and discarded the env var values. The result was that `EMBEDDING_MODEL`, `EMBEDDING_DIMENSIONS`, and `EMBEDDING_OLLAMA_BASE_URL` could never actually override the defaults.

### 2. Missing Env Var Wiring for Write Mode

The schema defined `WRITE_MODE` and `PRIMARY_STORE` with Zod defaults of `"chroma"`, but `config/index.ts` never passed `EMBEDDING_WRITE_MODE` or `EMBEDDING_PRIMARY_STORE` to the `.parse()` call. These fields always used their defaults regardless of what was set in the environment, making it impossible to switch to pgvector or dual-write mode without a code change.

### 3. Vector Store Abstraction Bypassed

`embeddings.find.ts` imported `chromaClient` directly from `@/lib/chroma` and called Chroma's text-based query method. This hardcoded Chroma as the only query target, making the function incompatible with the pgvector and dual-write modes that the rest of the embedding service supported through the composite store.

### 4. RAG Config Duplication

`RAG_STALENESS_CONFIG.DEFAULT_STALENESS_MONTHS` in `rag.config.ts` duplicated the centralized `ragConfig.stalenessMonths` from `@/config` — both defaulted to 24. The staleness function used the local constant as its fallback, meaning the `RAG_STALENESS_MONTHS` environment variable was only honored when the caller explicitly passed it. Additionally, `MIN_SIMILARITY` and `RELEVANCE_THRESHOLD` in `RAG_CONTEXT_CONFIG` were both set to 0.7 and used in different code paths for the same concept, creating confusion about which to use.

### 5. Dead Code

`rag.find.ts` and `rag.insert.ts` in the RAG service's operations directory were empty files with no exports or implementations.

## Changes Made

### Embedding Config (config.types.ts, config/index.ts, test.config.ts)

Refactored `embeddingConfigSchema` to use camelCase field names matching the codebase convention: `model`, `dimensions`, `ollamaBaseUrl`, `writeMode`, `primaryStore`. Added `writeMode` and `primaryStore` as explicit fields with env var wiring.

Updated `config/index.ts` to pass all five fields to `.parse()` with their corresponding `EMBEDDING_*` environment variables. Added `embedding: embeddingConfig` to the top-level config object.

Updated `test.config.ts` to parse and include the embedding config with `TEST_EMBEDDING_*` environment variables.

Added `IEmbeddingConfig` type export in `config.types.ts`.

### Embedding Factory (embeddings.factory.ts)

Updated all property accesses from UPPER_CASE to camelCase: `config.embedding.ollamaBaseUrl`, `config.embedding.model`, `config.embedding.dimensions`, `config.embedding.writeMode`, `config.embedding.primaryStore`.

### Embeddings Find (embeddings.find.ts)

Replaced the direct `chromaClient` import with `embeddingProvider` and `vectorStore` from the embedding factory. The function now embeds the query text via the pinned provider and delegates to the configured vector store, making it work correctly with Chroma, pgvector, and dual-write modes.

Updated the caller script (`retrieve-laws-from-chroma.ts`) to handle the flat array format returned by `VectorStore.query()` instead of Chroma's nested array format.

### RAG Config Cleanup (rag.config.ts, rag.staleness.ts, rag.context.ts)

Removed `RAG_STALENESS_CONFIG` from `rag.config.ts`. Updated `rag.staleness.ts` to import `ragConfig` from `@/config` and use `ragConfig.stalenessMonths` as the primary fallback, with a local `DEFAULT_STALENESS_MONTHS` constant as a safety net.

Removed `MIN_SIMILARITY` from `RAG_CONTEXT_CONFIG`, keeping only `RELEVANCE_THRESHOLD`. Updated `rag.context.ts` to use `RELEVANCE_THRESHOLD` consistently.

Deleted empty `rag.find.ts` and `rag.insert.ts` files and their empty `operations/` directory.

Updated `tests/rag.staleness.test.ts` to replace the removed `RAG_STALENESS_CONFIG` import with a local constant.

## Environment Variables Added

| Variable | Default | Purpose |
|----------|---------|---------|
| `EMBEDDING_MODEL` | `"nomic-embed-text"` | Ollama embedding model name |
| `EMBEDDING_DIMENSIONS` | `768` | Vector dimension size |
| `EMBEDDING_OLLAMA_BASE_URL` | `"http://localhost:11434"` | Ollama server URL |
| `EMBEDDING_WRITE_MODE` | `"chroma"` | `"chroma"`, `"pgvector"`, or `"dual"` |
| `EMBEDDING_PRIMARY_STORE` | `"chroma"` | `"chroma"` or `"pgvector"` — the read-primary store |

Test equivalents: `TEST_EMBEDDING_MODEL`, `TEST_EMBEDDING_DIMENSIONS`, `TEST_EMBEDDING_OLLAMA_BASE_URL`, `TEST_EMBEDDING_WRITE_MODE`, `TEST_EMBEDDING_PRIMARY_STORE`.
