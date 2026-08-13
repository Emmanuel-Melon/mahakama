# AGENTS.md

## Repo
- npm-workspaces monorepo: `api` (workspace `server`, Express 5 + TS) and `frontend` (workspace `client`, React Router 7 framework-mode/SSR + Vite + Tailwind v4 + shadcn/ui).
- Node v22.14.0 (`.nvmrc`). No committed lockfiles — CI runs `npm ci` and fails until they exist; use `npm install` locally.
- Root: `npm run dev` runs both (API `:3000`, frontend `:5173`); `npm run lint` / `format` / `build` cover all workspaces.
- The repo was recently consolidated into a monorepo; `api/README.md`, `frontend/README.md`, `api/contributing.md`, and `frontend/API.md` are stale on structure and stack. Trust `package.json` scripts and this file over prose docs.

## Workflow (manual execution)
- The agent writes code only. The agent does NOT execute scripts or commands on the user's behalf — including installs, dev servers, tests, typechecks, lints, builds, migrations, seeds, npm scripts (e.g. `chroma:import-laws`, `generate:types`), or manual API verification (curl/Swagger).
- All script execution and verification is performed manually by the user.
- After writing code, the agent hands off: a summary of the change plus the exact commands to run and what success looks like (see the per-workspace sections below).

## API (`api/`)
- DDD layout: `src/feature/<domain>/` with `operations/` (pure business logic), `controllers/` (+`tests/`), `*.routes.ts`, `*.schema.ts` (Zod + Drizzle), `*.types.ts`, `*.factory.ts`, `*.config.ts`. Shared infra in `src/lib/` (drizzle, chroma, llm, bullmq, redis, supabase, http, express, swagger, pdf-parse, logger); cross-domain services in `src/service/` (auth, inference, rag-service, embedding-service, notifications, search-service).
- Path alias `@/*` → `src/*`.
- Env: dotenv loads `api/.env` (or `.env.test` when `NODE_ENV=test`). All `.env*` are gitignored and there is no `.env.example` — see `src/config/index.ts` + `config.types.ts` for the required vars (DATABASE_URL, JWT_SECRET, GEMINI_API_KEY, CHROMA_*, REDIS/UPSTASH_*, SUPABASE_*, RESEND_KEY).
- Tests (vitest): `npm run test`/`test:watch` = all `src/**/*.test.ts`; `npm run test:unit` = only `src/feature/**/operations/**/*.test.ts`; `npm run test:integration` = `controllers/**/*.test.ts` via `vitest.integration.config.ts` and **requires Postgres + Redis** (CI provisions `postgres:16` + `redis:7`; locally use `infra/docker-compose.yml`).
- DB: PostgreSQL + Drizzle; migrations in `drizzle/` (currently a single `0000_*`). Schema glob is `src/feature/**/*.schema.ts` + `src/service/**/*.schema.ts` (widened during ingestion Phase III so service-owned tables like `document_chunks`/`embedding_jobs` get migrated). Commands: `drizzle:push|generate|migrate|studio|drop|reset`, `db:reset`, `seed`.
- Build = `tsc` (output `dist/src/server.js`) + 11ty docs (`build:docs`). `start` runs `node dist/src/server.js`. OpenAPI spec/UI at `/api-docs`, docs at `/docs`, health at `/api/health`.
- LLM: `ILLMClient` in `src/lib/llm/client.ts`, select via `getLLMClient(provider)` — Gemini or local Ollama. ChromaDB vector search in `src/lib/chroma` (embeddings `nomic-embed-text`, relevance threshold 0.7).

## Frontend (`frontend/`)
- Routes are NOT file-based. Declared centrally in `app/routes.ts`, pulling per-feature route config objects from `app/feature/<feature>/<Feature>Config.ts` (e.g. `ChatsConfig.ts`, `UsersConfig.ts`). To add/change a route, edit the feature config and `app/routes.ts`.
- Feature-organized code in `app/feature/<domain>/` (`screens/`, `components/`, `hooks/`); page components live in `app/routes/`.
- Path alias `~/*` → `app/*`.
- API types are generated from the backend OpenAPI spec, not hand-written: `npm run generate:types` (needs the backend running at `VITE_API_BASE_URL`; `generate:types:local` targets `localhost:3000`). Output is committed in `app/lib/api/generated/` (`api.types.ts`, `api.schemas.ts`) and consumed by `app/lib/api/*.api.ts`. Regenerate after backend schema/route changes.
- `npm run typecheck` = `react-router typegen && tsc` — typegen writes `.react-router/` (gitignored); run it after routing changes or on a fresh clone.
- Default API base is `http://localhost:3000/api` (see `app/config/index.ts`); override with `VITE_API_BASE_URL`. API CORS only allows `localhost:5173`.
- There is no test script and no tests (CI's `npm test` step is a no-op/fails). For manual verification the user runs `npm run typecheck` and `npm run build`.
- Deployment: API on Railway (`mahakama-api-production.up.railway.app`), frontend on Netlify (README) with a Vercel preset in `react-router.config.ts`; Dockerfiles in `infra/`.
