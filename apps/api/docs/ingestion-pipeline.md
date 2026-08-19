# Ingestion Pipeline

## Overview

The ingestion pipeline transforms uploaded legal documents into searchable vector embeddings. A document is parsed from PDF, split into section-aware chunks, enriched with legal metadata, persisted to Postgres, embedded into 768-dimensional vectors via Ollama, and stored in a vector database (Chroma or pgvector). The pipeline is asynchronous: an HTTP controller enqueues a BullMQ job, a worker processes the document, and progress events stream back to the client over SSE.

## API Entry Point

**POST /v1/documents/ingest** accepts a multipart form upload with a `file` field. The multer middleware processes the upload. The controller saves the file to storage, creates a `documents` row in the database, opens an SSE stream for ingestion progress, and enqueues a `DocumentJobs.DocumentUploaded` job on the BullMQ Documents queue.

## Job Processing

The BullMQ worker (`documents.worker.ts`) maps the `DocumentUploaded` job to `DocumentsJobHandler.handleDocumentUploaded` in `documents.jobs.ts`. This handler calls `processDocumentPipeline` and publishes SSE progress events throughout the process.

## Document Pipeline

`processDocumentPipeline` in `documents.ingest.ts` is the core ingestion function. It accepts a document ID and chunking options (defaulting to 1000-character chunks with 200-character overlap).

### Step 1: PDF Parsing

The function loads the document metadata from the database. If the document has a remote URL, it fetches and parses the PDF via `parsePdfFromUrl`. If it is a local file, it resolves the storage path and parses via `parsePdfFromPath`. Both use the `pdf-parse` library to extract raw text.

### Step 2: Section-Aware Chunking

The parsed text is passed to `chunkDocument` in `rag.chunker.ts`. The chunker first attempts to split the text by legal section headers using a regex that matches numbered sections like "26. Increase of rent." at line start.

If section headers are found, the text is split at each header. Preamble text before the first header (title page, table of contents, introduction) is split using character-based splitting. Each section body is kept whole if it fits within the chunk size; otherwise it is sub-split using character-based splitting. Each sub-chunk retains its section header for context.

If no section headers are found, the chunker falls back to pure character-based splitting with a sliding window. The splitter advances by the chunk size and backs up to the nearest word boundary (within a 20% tolerance of the chunk size) to avoid splitting mid-word. Each chunk overlaps with the next by the configured overlap size.

Each chunk receives an ID in the format `{documentId}-{index}` and carries its section label.

### Step 3: Metadata Enrichment

Each chunk is enriched with legal metadata: the document version, document ID, act name, full citation (deterministic format: "ActName, Section N"), jurisdiction, URL, and last-updated date. These fields are extracted from the document record and the chunk's section information.

### Step 4: Postgres Persistence

`saveDocumentChunks` in `embeddings.insert.ts` writes all enriched chunks to the `document_chunks` Postgres table. It first deletes any existing chunks for this document (idempotent for retries), then inserts new rows with content, chunk index, section metadata, and token counts computed via `js-tiktoken`. At this stage, the `embedding` column is NULL — embeddings are filled in separately.

### Step 5: Embedding Generation

`generateDocumentEmbeddings` in `embeddings.insert.ts` processes chunks in batches of 20. For each batch, it concatenates the title and content into a single text string ("{title}. {content}"), passes the batch to the Ollama `nomic-embed-text` embedding model via the embedding service's pinned provider, and builds `VectorRecord` objects with prefixed IDs (format: `law_{chunkId}-v{version}`) and full legal metadata.

### Step 6: Vector Storage

The `VectorRecord` objects are written to the vector store via `vectorStore.addDocuments`. The composite store routes this write to the configured primary store (Chroma or pgvector) and optionally to a shadow store if dual-write mode is active. Shadow write failures are logged but never fail the request.

In Chroma mode, this creates new entries in the configured collection. In pgvector mode, this updates the existing `document_chunks` rows' `embedding` columns (the rows were created in step 4). After each batch, the function verifies the write by reading back the stored IDs.

### Step 7: Old Version Cleanup

If the document version is greater than 1 (indicating a re-ingestion after an amendment), the function deletes the previous version's chunks from Chroma using a metadata filter on `document_id` and `version: currentVersion - 1`.

### Step 8: Job Completion

The embedding job status is updated to `COMPLETED` in the `embedding_jobs` table. If any step fails, the job is marked as `FAILED` with the error message.

## Vector Store Architecture

The embedding service uses a strategy pattern with two core abstractions defined in `embeddings.types.ts`:

**EmbeddingProvider** converts text into vectors. The only implementation is the Ollama provider, which calls Ollama's `POST /api/embeddings` endpoint one text at a time (batched client-side via `Promise.all` since most Ollama versions do not support server-side batching).

**VectorStore** handles vector CRUD and similarity search. Two implementations exist:

- The Chroma store wraps the `chromaClient` from `@/lib/chroma`, delegating all operations to Chroma Cloud (or a local Chroma instance). Query results with null documents or distances are filtered out with a warning.

- The pgvector store uses Drizzle ORM with PostgreSQL's pgvector extension. Its `addDocuments` method updates existing rows (does not insert) — it relies on the metadata rows already existing from step 4. Its `query` method performs cosine similarity search using Drizzle's `cosineDistance` operator, ordered by similarity descending.

**Composite store** (`stores/index.ts`) wraps a primary store and an optional shadow store. Writes go to both (shadow failures are caught and logged, not thrown). Reads go only to primary only. This supports zero-downtime migration between Chroma and pgvector.

**Factory** (`embeddings.factory.ts`) wires the provider and store together based on configuration:

| writeMode    | primaryStore | Result                            |
| ------------ | ------------ | --------------------------------- |
| `"chroma"`   | `"chroma"`   | Primary: Chroma, no shadow        |
| `"pgvector"` | `"pgvector"` | Primary: pgvector, no shadow      |
| `"dual"`     | `"chroma"`   | Primary: Chroma, shadow: pgvector |
| `"dual"`     | `"pgvector"` | Primary: pgvector, shadow: Chroma |

The factory always wraps the result in the composite store for a consistent interface.

## Database Schema

The `document_chunks` table (defined in `embeddings.schema.ts`) stores both metadata and embeddings:

- `id` (uuid PK), `documentId` (FK to documents, cascade delete), `content`, `chunkIndex`
- Legal metadata: `section`, `subsection`, `articleNumber`, `actName`, `fullCitation`, `url`, `jurisdiction`, `lastUpdated`, `version`
- Embedding: `embedding` (vector(768)), `embeddingProvider`, `embeddingModel`
- `tokenCount`, `createdAt`

A HNSW index on the embedding column uses `vector_cosine_ops` for efficient similarity search.

The `embedding_jobs` table tracks ingestion job progress: `id`, `documentId` (FK), `status`, `totalChunks`, `processedChunks`, `error`, `startedAt`, `completedAt`, `createdAt`.

## Configuration

The embedding pipeline reads its configuration from two sources:

Centralized in `embeddingConfig` (from `@/config`), all configurable via environment variables:

| Variable                    | Default                    | Purpose                                             |
| --------------------------- | -------------------------- | --------------------------------------------------- |
| `EMBEDDING_MODEL`           | `"nomic-embed-text"`       | Ollama embedding model name                         |
| `EMBEDDING_DIMENSIONS`      | `768`                      | Vector dimension size                               |
| `EMBEDDING_OLLAMA_BASE_URL` | `"http://localhost:11434"` | Ollama server URL                                   |
| `EMBEDDING_WRITE_MODE`      | `"pgvector"`               | `"chroma"`, `"pgvector"`, or `"dual"`               |
| `EMBEDDING_PRIMARY_STORE`   | `"pgvector"`               | `"chroma"` or `"pgvector"` — the read-primary store |

Local constants in `embeddings.config.ts`: `CHUNK_CONFIG` (chunk size 1000, overlap 200, word boundary tolerance 0.2, section header regex), `EMBEDDING_CONFIG` (batch size 20, ID prefix "law_", dimensions 768). The dimensions constant is intentionally duplicated from the runtime config — Drizzle requires a compile-time literal for the vector column definition, and changing it requires a migration, not just an env var flip.

## Scripts

- `import-laws-to-chroma.ts` — one-time seed script that embeds 70 hardcoded legal entries from Uganda's Constitution and the Landlord & Tenant Act into the "legal_questions" collection.
- `backfill-pgvector.ts` — migration script that reads embeddings from Chroma and copies them into the `embedding` column of `document_chunks` for rows that have no embedding yet.
- `reingest-uploads.ts` — re-runs `processDocumentPipeline` on existing uploaded documents.

## File Reference

| File                              | Purpose                                                                                          |
| --------------------------------- | ------------------------------------------------------------------------------------------------ |
| `embeddings.types.ts`             | Core interfaces: `EmbeddingProvider`, `VectorStore`, `VectorRecord`, `DocumentChunk`, job types  |
| `embeddings.config.ts`            | Local constants: chunking parameters, batch size, ID prefix, dimensions                          |
| `embeddings.factory.ts`           | Wires provider + store based on config; exports `embeddingProvider` and `vectorStore` singletons |
| `embeddings.schema.ts`            | Drizzle table definitions: `document_chunks` (with HNSW index), `embedding_jobs`                 |
| `embeddings.utils.ts`             | Utilities: `buildChunkId` (prefixed IDs), `buildChunkMetadata` (metadata object)                 |
| `providers/ollama.provider.ts`    | Ollama embedding provider: calls `/api/embeddings` per text, client-side batching                |
| `stores/chroma.store.ts`          | Chroma vector store adapter: delegates to `chromaClient`, flattens nested results                |
| `stores/pgvector.store.ts`        | pgvector store adapter: updates existing rows, cosine similarity search via Drizzle              |
| `stores/index.ts`                 | Composite store factory: primary + optional shadow write for migration                           |
| `operations/embeddings.insert.ts` | `saveDocumentChunks` (Postgres metadata write), `generateDocumentEmbeddings` (embed + store)     |
| `operations/embeddings.find.ts`   | `findEmbedding`: embeds query text, delegates to vector store                                    |
| `operations/embeddings.remove.ts` | `removeDocumentEmbeddings`: deletes chunks and jobs for a document                               |
| `operations/embeddings.update.ts` | `upsertEmbeddingJob`, `markEmbeddingJobFailed`: job status management                            |
