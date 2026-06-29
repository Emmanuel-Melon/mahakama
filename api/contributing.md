# Contributing to Mahakama Server

This guide focuses on the technical navigation and architecture of the Mahakama API.

## Core Architecture

The server uses a **Domain-Driven Design (DDD)** approach. Code is organized by business domains (e.g., `users`, `chats`, `documents`) rather than technical layers.

### Domain Structure

Each domain inside `src/` follows this structure:

- `controllers/`: HTTP request/response handling.
- `operations/`: Pure, framework-agnostic business logic.
- `*.routes.ts`: Route definitions and Swagger documentation.
- `*.middleware.ts`: Domain-specific validation.
- `*.schema.ts`: Zod schemas, Drizzle tables, and TypeScript types.
- `*.types.ts`: Domain-specific interfaces.

### Semantic Search & RAG

The API utilizes **ChromaDB** for vector storage and semantic search, managed via `src/lib/chroma/` and the RAG pipeline in `src/rag-pipeline/`.

- Documents are chunked and vectorized using `nomic-embed-text` via Ollama.
- Similarity searches are performed with a relevance threshold of 0.7.

### LLM Integration

We use a unified interface (`ILLMClient`) in `src/lib/llm/client.ts` to swap between providers like Google Gemini (`gemini-2.0-flash`) and local Ollama instances.

- Use the `getLLMClient(provider)` helper in your operations to handle AI-powered logic.
