# Mahakama Frontend

The public-facing React web interface for Mahakama, served from this npm-workspaces monorepo. It lets users ask legal questions in plain language and get verifiable, source-referenced answers, or connect with vetted lawyers.

## Tech Stack

- **Framework**: React 19 with TypeScript (React Router 7 framework-mode/SSR)
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS v4 with shadcn/ui components (`@mah/ui`)
- **State**: TanStack React Query for server state
- **Forms**: React Hook Form with Zod
- **API**: `@mah/api` type-safe client
- **i18n**: i18next (English + Arabic)
- **Deployment**: Netlify (with a Vercel preset in `react-router.config.ts`)

## Running

From the repo root:

```bash
npm install
npm run dev
```

Runs the API on `:3000` and the frontend on `:5173`. Or run the frontend workspace alone:

```bash
npm run dev --workspace=frontend
```

## Architecture

- Routes are declared centrally in `app/routes.ts`, pulling per-feature route config objects from `app/feature/<feature>/<Feature>Config.ts` (e.g. `ChatsConfig.ts`, `UsersConfig.ts`). To add/change a route, edit the feature config and `app/routes.ts`.
- Feature-organized code lives in `app/feature/<domain>/` (`screens/`, `components/`, `hooks/`); page components live in `app/routes/`.
- Path alias `~/*` → `app/*`.
- API clients and react-query hooks come from the `@mah/api` package (`packages/api/`), e.g. `@mah/api/clients/chat.api` and `@mah/api/hooks/use-chats`.
- i18n mirrors the admin pattern: per-feature `app/locales/{en,ar}/<feature>.json`, aggregated via `app/lib/i18n/index.ts` and type-safe keys in `app/lib/i18n/i18next.d.ts`.

## Scripts

| Command                        | Purpose                       |
| ------------------------------ | ----------------------------- |
| `npm run dev`                  | Start dev server              |
| `npm run typecheck`            | `react-router typegen && tsc` |
| `npm run build`                | `react-router build`          |
| `npm run generate:types[:local | :prod]`                       | Regenerate `@mah/api` types from the OpenAPI spec |

Default API base is `http://localhost:3000/api` (see `app/config/index.ts`); override with `VITE_API_BASE_URL`. API CORS only allows `localhost:5173`.

## API Documentation

See [`./API.md`](./API.md) for the API integration guide. Interactive OpenAPI docs are available at `/api-docs`.

## Deployment

Frontend is deployed on Netlify. Dockerfiles live in `infra/`.
