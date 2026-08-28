# Contributing to Mahakama API

This guide covers the technical navigation and architecture of the Mahakama API. It complements the repository root `AGENTS.md`, which is the source of truth for the overall monorepo workflow.

## Workflow (manual execution)

The agent writes code only. Scripts, tests, typechecks, lints, builds, migrations, seeds, and manual API verification are performed manually by the user. After writing code, hand off a summary of the change plus the exact commands to run and what success looks like.

## Core Architecture

The server uses **Domain-Driven Design (DDD)**. Code is organized by business domain (e.g. `users`, `chats`, `documents`, `corpus`, `lawyers`) rather than by technical layer.

### Domain structure

Each domain under `src/feature/<domain>/` follows:

- `operations/` — pure, framework-agnostic business logic.
- `controllers/` (+ `tests/`) — HTTP request/response handling.
- `*.routes.ts` — route definitions and Swagger documentation.
- `*.schema.ts` — Zod schemas, Drizzle tables, and (via `drizzle-zod`) TypeScript types.
- `*.types.ts` — domain-specific interfaces.
- `*.factory.ts` / `*.config.ts` — domain factories and configuration.

Shared infrastructure lives in `src/lib/` (drizzle, chroma, llm, bullmq, redis, supabase, http, express, swagger, pdf-parse, logger). Cross-domain services live in `src/service/` (auth, inference, rag-service, embedding-service, notifications, search-service).

Path alias: `@/*` → `src/*`.

### Semantic search & RAG

The API uses **ChromaDB** for vector storage and semantic search via `src/lib/chroma/` and the RAG pipeline in `src/service/`. Documents are chunked and vectorized (usage of `nomic-embed-text` via embeddings) and similarity searches use a relevance threshold of 0.7.

### LLM integration

A unified `ILLMClient` interface in `src/lib/llm/client.ts` swaps between providers (Google Gemini or local Ollama). Use `getLLMClient(provider)` in operations for AI-powered logic.

## Database

- PostgreSQL + Drizzle ORM; migrations in `drizzle/`.
- Schema glob: `src/feature/**/*.schema.ts` + `src/service/**/*.schema.ts`.
- Commands: `drizzle:push|generate|migrate|studio|drop|reset`, `db:reset`, `seed`.

## Tests

- `npm run test` / `test:watch` — all `src/**/*.test.ts`.
- `npm run test:unit` — only `src/feature/**/operations/**/*.test.ts`.
- `npm run test:integration` — `controllers/**/*.test.ts` via `vitest.integration.config.ts`; requires Postgres + Redis (CI provisions `postgres:16` + `redis:7`; locally use `infra/docker-compose.yml`).

## Build & docs

- `npm run build` = `tsc` (output `dist/src/server.js`) + `build:docs` (11ty).
- `npm start` runs `node dist/src/server.js`.
- OpenAPI spec/UI at `/api-docs`; project docs at `/docs`; health at `/api/health`.

## Environment

Env is loaded from `api/.env` (or `.env.test` when `NODE_ENV=test`). All `.env*` are gitignored; there is no `.env.example`. See `src/config/index.ts` + `config.types.ts` for required variables (`DATABASE_URL`, `JWT_SECRET`, `GEMINI_API_KEY`, `CHROMA_*`, `REDIS/UPSTASH_*`, `SUPABASE_*`, `RESEND_KEY`).
