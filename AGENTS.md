# AGENTS.md

## Repo

- npm-workspaces monorepo: `apps/api` (workspace `server`, Express 5 + TS), `apps/frontend` (workspace `client`, React Router 7 framework-mode/SSR + Vite + Tailwind v4 + shadcn/ui), `apps/admin` (workspace `admin`, React Router 8 framework-mode/SSR), and shared source packages in `packages/` (`@mah/client`, `@mah/api`, `@mah/ui`, `@mah/eslint-config`, `@mah/typescript-config`).
- Node v22.14.0 (`.nvmrc`). No committed lockfiles — CI runs `npm ci` and fails until they exist; use `npm install` locally.
- Root: `npm run dev` runs `apps/api` (`:3000`) and `apps/frontend` (`:5173`) concurrently (admin runs separately via `npm run dev --workspace=admin`); `npm run lint` / `format` / `build` cover all workspaces.

## Workflow (manual execution)

- The agent writes code only. The agent does NOT execute scripts or commands on the user's behalf — including installs, dev servers, tests, typechecks, lints, builds, migrations, seeds, npm scripts (e.g. `chroma:import-laws`, `generate:types`), or manual API verification (curl/Swagger).
- All script execution and verification is performed manually by the user.
- After writing code, the agent hands off: a summary of the change plus the exact commands to run and what success looks like (see the per-workspace sections below).

## API (`apps/api/`)

- DDD layout: `src/feature/<domain>/` with `operations/` (pure business logic), `controllers/` (+`tests/`), `*.routes.ts`, `*.schema.ts` (Zod + Drizzle), `*.types.ts`, `*.factory.ts`, `*.config.ts`. Shared infra in `src/lib/` (drizzle, chroma, llm, bullmq, redis, supabase, http, express, swagger, pdf-parse, logger); cross-domain services in `src/service/` (auth, inference, rag-service, embedding-service, notifications, search-service).
- Path alias `@/*` → `src/*`.
- Env: dotenv loads `api/.env` (or `.env.test` when `NODE_ENV=test`). All `.env*` are gitignored and there is no `.env.example` — see `src/config/index.ts` + `config.types.ts` for the required vars (DATABASE_URL, JWT_SECRET, GEMINI_API_KEY, CHROMA__, REDIS/UPSTASH__, SUPABASE_*, RESEND_KEY).
- Tests (vitest): `npm run test`/`test:watch` = all `src/**/*.test.ts`; `npm run test:unit` = only `src/feature/**/operations/**/*.test.ts`; `npm run test:integration` = `controllers/**/*.test.ts` via `vitest.integration.config.ts` and **requires Postgres + Redis** (CI provisions `postgres:16` + `redis:7`; locally use `infra/docker-compose.yml`).
- DB: PostgreSQL + Drizzle; migrations in `drizzle/` (currently a single `0000_*`). Schema glob is `src/feature/**/*.schema.ts` + `src/service/**/*.schema.ts` (widened during ingestion Phase III so service-owned tables like `document_chunks`/`embedding_jobs` get migrated). Commands: `drizzle:push|generate|migrate|studio|drop|reset`, `db:reset`, `seed`.
- Build = `tsc` (output `dist/src/server.js`) + 11ty docs (`build:docs`). `start` runs `node dist/src/server.js`. OpenAPI spec/UI at `/api-docs`, docs at `/docs`, health at `/api/health`.
- LLM: `ILLMClient` in `src/lib/llm/client.ts`, select via `getLLMClient(provider)` — Gemini or local Ollama. ChromaDB vector search in `src/lib/chroma` (embeddings `nomic-embed-text`, relevance threshold 0.7).

## Frontend (`apps/frontend/`)

- Routes are NOT file-based. Declared centrally in `app/routes.ts`, pulling per-feature route config objects from `app/feature/<feature>/<Feature>Config.ts` (e.g. `ChatsConfig.ts`, `UsersConfig.ts`). To add/change a route, edit the feature config and `app/routes.ts`.
- Feature-organized code in `app/feature/<domain>/` (`screens/`, `components/`, `hooks/`); page components live in `app/routes/`.
- Path alias `~/*` → `app/*`.
- API client + data hooks live in the `@mah/api` package (`packages/api/`), organized as `src/clients/*.api.ts` (API clients) and `src/hooks/use-*.ts(x)` (react-query hooks); consumed by the frontend as `@mah/api/clients/chat.api`, `@mah/api/hooks/use-chats`, etc. Shared primitives stay at the root: `@mah/api/fetch`, `@mah/api/api.utils`, `@mah/api/api.routes`, `@mah/api/generated/api.types`. Route constants (`AUTH_API_ROUTES`, `DOCUMENTS_API_ROUTES`, `LAWYERS_API_ROUTES`) are exported from `@mah/api/api.routes`; feature Configs re-export them.
- API types are generated from the backend OpenAPI spec, not hand-written: `npm run generate:types --workspace=@mah/api` (needs the backend running at `VITE_API_BASE_URL`; `generate:types:local` targets `localhost:3000`; the frontend also exposes `npm run generate:types[:local|:prod]` wrappers). Output is committed in `packages/api/src/generated/` (`api.types.ts`, `api.schemas.ts`) and consumed by `packages/api/src/clients/*.api.ts`. Regenerate after backend schema/route changes.
- `npm run typecheck` = `react-router typegen && tsc` — typegen writes `.react-router/` (gitignored); run it after routing changes or on a fresh clone.
- Default API base is `http://localhost:3000/api` (see `app/config/index.ts`); override with `VITE_API_BASE_URL`. API CORS only allows `localhost:5173`.
- There is no test script and no tests (CI's `npm test` step is a no-op/fails). For manual verification the user runs `npm run typecheck` and `npm run build`.
- Deployment: API on Railway (`mahakama-api-production.up.railway.app`), frontend on Netlify (README) with a Vercel preset in `react-router.config.ts`; Dockerfiles in `infra/`.

## Admin (`apps/admin/`)

- React Router 8 framework-mode app (workspace `admin`) for internal content review/management. Shares the same stack and conventions as the frontend and reuses `@mah/client`, `@mah/api`, and `@mah/ui`.
- Routes are NOT file-based. Declared centrally in `app/routes.ts`, pulling per-feature route config objects from `app/feature/<feature>/<Feature>Config.ts` (e.g. `LawyersConfig.ts`, `AuthConfig.ts`, `CorpusConfig.ts`, `DashboardConfig.ts`). To add/change a route, edit the feature config and `app/routes.ts`.
- Feature-organized code in `app/feature/<domain>/` (`screens/`, `components/`); page components live in `app/routes/`.
- Path alias `~/*` → `app/*`.
- i18n mirrors the established pattern: each feature config exports an `I18nConfig` (`authI18n`, `lawyersI18n`, etc.) built from `app/locales/{en,ar}/<feature>.json`; `app/lib/i18n/index.ts` aggregates them for i18next. Type-safe keys are declared in `app/lib/i18n/i18next.d.ts` — register the `resources.<namespace>` slot when adding a feature. Uses `useTranslation("<namespace>")` in screens/components.
- `npm run typecheck` = `react-router typegen && tsc`; `npm run build` = `react-router build`. No test script.

## Packages (`packages/`)

Shared source packages consumed by the apps. Each has its own `AGENTS.md`; key contracts:

- `@mah/client` — framework-agnostic client primitives: `i18n` (the `I18nConfig` type + aggregator), `nav` (`defineRoutes`/typed routing helpers used by feature Configs), and `errors` (unified error config/types/utils).
- `@mah/api` — TypeScript client for the backend, generated from the OpenAPI spec: `src/generated/api.types.ts` + `api.schemas.ts`, hand-written `src/clients/*.api.ts` (axios) and `src/hooks/use-*.ts(x)` (react-query). Regenerate types after backend schema/route changes (see Frontend section).
- `@mah/ui` — shared design system (shadcn/ui based): `src/components/` organized into primitives, `atoms/`, `molecules/`, `organisms/`, `errors/`, `layout/`, plus `src/lib` and `src/hooks`. Exposes `globals.css`.
- `@mah/eslint-config` — shared ESLint presets (`base`, `next-js`, `react-internal`).
- `@mah/typescript-config` — shared TS configs (`base`, `node`, `react-library`).
