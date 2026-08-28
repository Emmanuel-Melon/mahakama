# Mahakama API

The Express.js backend and AI-driven legal analysis engine for Mahakama. It serves the frontend (`apps/frontend`) and admin (`apps/admin`) applications from this npm-workspaces monorepo.

## Tech Stack

- **Runtime**: Node.js + TypeScript (Express 5)
- **Database**: PostgreSQL with Drizzle ORM
- **Vector Search**: ChromaDB with `nomic-embed-text` embeddings
- **LLM**: `ILLMClient` interface — Google Gemini or local Ollama
- **Queue / Cache / Auth**: BullMQ, Upstash Redis, JWT, Supabase, Resend
- **Docs**: OpenAPI/Swagger and 11ty-generated project docs

## Running

From the repo root (runs the API on `:3000` and the frontend on `:5173`):

```bash
npm install
npm run dev
```

Or run just the API workspace:

```bash
npm run dev --workspace=api
```

Environment is loaded from `api/.env` (or `.env.test` when `NODE_ENV=test`). There is no committed `.env.example`; see `src/config/index.ts` + `config.types.ts` for the required variables (`DATABASE_URL`, `JWT_SECRET`, `GEMINI_API_KEY`, `CHROMA_*`, `REDIS/UPSTASH_*`, `SUPABASE_*`, `RESEND_KEY`).

## Architecture

Domain-Driven Design: code is organized by business domain under `src/feature/<domain>/`, each containing `operations/` (pure business logic), `controllers/`, `*.routes.ts`, `*.schema.ts` (Zod + Drizzle), `*.types.ts`, `*.factory.ts`, and `*.config.ts`.

- Shared infrastructure lives in `src/lib/` (drizzle, chroma, llm, bullmq, redis, supabase, http, express, swagger, pdf-parse, logger).
- Cross-domain services live in `src/service/` (auth, inference, rag-service, embedding-service, notifications, search-service).
- Path alias `@/*` → `src/*`.

### Data & Search

- PostgreSQL + Drizzle; migrations in `drizzle/`. Schema glob: `src/feature/**/*.schema.ts` + `src/service/**/*.schema.ts`.
- ChromaDB for semantic search (`src/lib/chroma`, relevance threshold 0.7).
- LLM clients via `getLLMClient(provider)` in `src/lib/llm/client.ts` (`ILLMClient`).

## Scripts

| Command                     | Purpose                                      |
| --------------------------- | -------------------------------------------- |
| `npm run dev`               | Start dev server (tsx watch)                 |
| `npm run build`             | `tsc` + `build:docs`                         |
| `npm start`                 | Run `dist/src/server.js`                     |
| `npm run typecheck`         | `tsc --noEmit`                               |
| `npm run lint` / `format`   | ESLint / Prettier                            |
| `npm test` / `test:watch`   | Vitest (all `src/**/*.test.ts`)              |
| `npm run test:unit`         | Operations tests only                        |
| `npm run test:integration`  | Controller tests (requires Postgres + Redis) |
| `npm run drizzle:push       | generate                                     | migrate | studio | drop | reset` | Drizzle DB commands |
| `npm run db:reset` / `seed` | Reset and seed the database                  |

### Useful endpoints

| Path             | Description                |
| ---------------- | -------------------------- |
| `/api/health`    | Health check               |
| `/api-docs`      | OpenAPI interactive UI     |
| `/api-docs-json` | OpenAPI spec JSON          |
| `/docs`          | 11ty project documentation |

## Contributing

See [`./contributing.md`](./contributing.md) and the repository root `AGENTS.md` for the workflow (agent writes code; the user runs scripts/verification manually).
