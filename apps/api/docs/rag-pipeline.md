# RAG Pipeline

## Overview

Mahakama is a legal Q&A assistant for Uganda and South Sudan. The RAG (Retrieval-Augmented Generation) pipeline retrieves relevant legal text from a vector store, assembles a grounded prompt, and streams an LLM-generated answer back to the client over SSE. The pipeline is fully asynchronous: HTTP controllers enqueue BullMQ jobs, a worker processes each job, and the answer streams back through Node.js EventEmitter relays.

## API Entry Points

There are two routes that trigger the RAG pipeline, plus a retry endpoint:

- **POST /v1/chats** — creates a new chat session and the first user message, then enqueues a `ChatsJobs.MessageSent` job on the BullMQ Chat queue.
- **POST /v1/messages** — sends a follow-up message to an existing chat, saves it to the database, and enqueues the same `ChatsJobs.MessageSent` job.
- **POST /v1/messages/:messageId/retry** — resets a failed reply's status to pending and re-enqueues the job.

Both the create-chat and send-message controllers follow the same pattern: persist the user message, open an SSE stream, subscribe to the chat event emitter for that chatId, and enqueue the job. The SSE stream stays open until the worker publishes a `Completed` or `Error` event.

## Job Processing

The BullMQ worker (`chats.worker.ts`) maps the `MessageSent` job to `ChatsJobHandler.handleMessageSent` in `chats.jobs.ts`. This handler loads the user message and full conversation history from the database, then calls `generateStreamingAssistantReply` from the RAG answer module. The handler also manages job lifecycle: it publishes a `Started` event when processing begins, marks the reply as `COMPLETED` on success, and marks it `FAILED` with an `Error` event on failure.

The `ChatCreated` job follows the same path — it finds the first user message in the new chat and delegates to `handleMessageSent`.

## Context Retrieval

`RAGService.retrieveContext()` in `rag.service.ts` is the core retrieval function. It accepts a question string and options (collection name, top-K, minimum similarity).

The function validates the query through a Zod schema that requires 3 to 1000 characters. It then embeds the query text into a 768-dimensional vector using the Ollama `nomic-embed-text` model via the embedding service's pinned provider. The resulting vector is passed to the vector store's query method, which performs cosine similarity search against either Chroma or pgvector (depending on configuration), returning the top-K most similar chunks (default 5).

Each result is converted from distance to similarity using `1 - distance`, clamped to the 0-1 range. Results below the minimum similarity threshold (default 0.7) are filtered out.

For each surviving result, the function loads the current document version from the Postgres `documents` table via `loadDocumentVersions`. This enables staleness detection: a chunk is stale if its version is behind the document's current version (indicating the law was re-ingested after an amendment) or if its `lastUpdated` date exceeds the staleness window (default 24 months, configurable via `RAG_STALENESS_MONTHS`).

The function deduplicates sources by `fullCitation` (or `title|section` as fallback) and returns `{ chunks, sources }`.

## Context Building

`buildRagContext` in `rag.context.ts` wraps the retrieval call with error resilience and conversation history formatting. If the vector store is unavailable, the function degrades gracefully to an empty context rather than failing the entire message flow.

Conversation history is extracted from the full message list, limited to the last 10 turns, filtered to only `user` and `assistant` sender types, and mapped to `{ role, content }` tuples.

The combined result — `{ context, conversationHistory }` — is passed to the prompt builder.

## Prompt Assembly

`buildRagChatPrompt` in `rag.prompts.ts` constructs a single prompt string with these sections:

The system instructions establish the assistant's identity as Mahakama, a legal assistant for Uganda and South Sudan. The instructions enforce strict grounding: the assistant must answer only from the provided legal context, never from general knowledge. It must cite specific laws and sections, reproduce citation strings verbatim, and never invent laws, section numbers, or dates. If no context is found, the assistant must say so and stop — it must not fabricate answers. The assistant is also instructed not to advise users to take specific actions, but rather to explain rights and direct them to a lawyer.

The relevant legal context section formats each retrieved chunk as its full citation followed by its content, separated by horizontal rules. If no chunks were retrieved, a strict "none found" instruction tells the LLM not to answer at all.

The conversation history section lists previous turns as "User: ..." and "Assistant: ..." lines.

If any chunks were flagged as stale during retrieval, a conditional section lists them with their last-updated dates and instructs the LLM to add a staleness warning to its answer.

The prompt ends with the user's question and an "ANSWER:" suffix.

## LLM Generation

The answer module selects an LLM client through a provider manager that defaults to Ollama with the `gemma3:1b` model and falls back to Gemini if Ollama is unavailable.

The streaming path (`generateStreamingAssistantReply`) is used in production. It calls `client.generateStreamContent` with the assembled prompt and a token callback. Each token is published as a `Token` event through the chat event emitter, which the SSE controller relays to the HTTP client in real time.

The non-streaming path (`generateAssistantReply`) exists but is not used in production.

## Post-Generation Citation Validation

After the full answer is generated, the system extracts citations by scanning the text against five regex patterns that match Ugandan legal references: Act names with years, Article references, Section references, short-form section references, and whole-instrument references to the Constitution of Uganda.

Each extracted citation is cross-checked against a whitelist built from the `fullCitation` values of the retrieved chunks. A citation is considered valid if the whitelist contains an entry that equals or contains it (case-insensitive). For example, "Section 26" passes if "Landlord and Tenant Act 2022, Section 26" was in the retrieved context.

Citations not found in the whitelist are flagged as fabricated. This is advisory only — fabricated citations are stored in the message metadata but do not block the response from reaching the user.

The complete assistant message is saved to the database with metadata including the citation status, the full list of extracted citations, the whitelist, any fabricated citations, whether stale sources were present, and the source list.

## Staleness Detection

`isChunkStale` in `rag.staleness.ts` implements two staleness checks with a fail-open policy:

Version-based staleness: if the chunk's version is less than the document's current version in the database, the chunk is stale. This catches law amendments — when a document is re-ingested after a legal change, its version bumps, and all older chunks are flagged.

Age-based staleness: if the chunk's `lastUpdated` date is present and older than the staleness window (default 24 months, configurable via `ragConfig.stalenessMonths`), the chunk is stale. This catches laws that haven't been re-verified recently.

If there is insufficient information to judge — no `lastUpdated`, an unparseable date, or missing version fields — the chunk is not flagged as stale.

## Configuration

The RAG pipeline reads its configuration from two sources:

Centralized in `ragConfig` (from `@/config`): only `stalenessMonths`, configurable via the `RAG_STALENESS_MONTHS` environment variable (default 24).

Local constants in `rag.config.ts`: `COLLECTION_NAME` ("legal_questions"), `TOP_K` (5), `RELEVANCE_THRESHOLD` (0.7), and `HISTORY_LIMIT` (10). These are not currently configurable via environment variables.

The citation regex patterns are also defined in `rag.config.ts` and are not configurable.

## File Reference

| File               | Purpose                                                                                                     |
| ------------------ | ----------------------------------------------------------------------------------------------------------- |
| `rag.types.ts`     | Zod schemas and TypeScript types for queries, chunks, sources, context, and staleness inputs                |
| `rag.config.ts`    | Local constants: collection name, top-K, relevance threshold, history limit, citation patterns              |
| `rag.service.ts`   | Core retrieval: embed query, vector search, filter by similarity, staleness check, source deduplication     |
| `rag.context.ts`   | Orchestrator: wraps retrieval with error resilience, formats conversation history                           |
| `rag.answer.ts`    | LLM generation: streaming and non-streaming paths, post-generation citation validation, message persistence |
| `rag.prompts.ts`   | Prompt assembly: system instructions, context formatting, history, staleness warnings                       |
| `rag.staleness.ts` | Staleness logic: version-based and age-based checks with fail-open policy                                   |
| `rag.citations.ts` | Citation extraction (5 regex patterns) and fabrication detection (whitelist cross-check)                    |
| `rag.chunker.ts`   | Section-aware document chunking with character-based splitting and word boundary tolerance                  |
| `rag.documents.ts` | Document version loading from Postgres for staleness comparison                                             |
