# Mahakama API Integration Guide

This document explains how the frontend and admin apps integrate with the Mahakama backend. The API is typed from a generated OpenAPI spec and accessed through the shared `@mah/api` package.

## Interactive API Documentation

The backend exposes interactive OpenAPI/Swagger documentation:

- **Production**: `https://mahakama-api-production.up.railway.app/api-docs`
- **Local**: `http://localhost:3000/api-docs`

The raw OpenAPI spec (used for type generation) is at `/api-docs-json`.

## Base URL

All API endpoints are relative to `/api` on the host:

- **Production**: `https://mahakama-api-production.up.railway.app/api`
- **Development**: `http://localhost:3000/api`

The frontend default base is `http://localhost:3000/api` (see `apps/frontend/app/config/index.ts`), overridable via `VITE_API_BASE_URL`. API CORS only allows `localhost:5173`.

## Authentication

Most endpoints require a JWT bearer token:

```
Authorization: Bearer <your_jwt_token>
```

Use the `/auth/login` (and `/auth/register`) endpoints to obtain a token. In Swagger UI, use the "Authorize" button to set it.

## Type-Safe Client (`@mah/api`)

Types are generated from the backend OpenAPI spec — do not hand-write them. They are committed in `packages/api/src/generated/` (`api.types.ts` + `api.schemas.ts`).

### Regenerate types

Requires the backend running at `VITE_API_BASE_URL`:

```bash
# Local (localhost:3000)
npm run generate:types:local --workspace=@mah/api

# Production
npm run generate:types:prod --workspace=@mah/api
```

The frontend also exposes wrappers: `npm run generate:types[:local|:prod]` (run from `apps/frontend`).

Regenerate after any backend schema or route change, then commit the updated `packages/api/src/generated/` files.

### Client structure (`packages/api/src/`)

- `generated/` — generated `api.types.ts` + `api.schemas.ts`.
- `clients/*.api.ts` — hand-written axios API clients (e.g. `chat.api.ts`, `auth.api.ts`, `lawyers.api.ts`).
- `hooks/use-*.ts(x)` — react-query hooks (e.g. `use-chats`, `use-lawyers`).
- `api/`, `axios/`, `react-query/` — shared request/response handling, interceptors, and query config.

### Example usage

```typescript
import { chatApi } from "@mah/api/clients/chat.api";
import { useLawyers } from "@mah/api/hooks/use-lawyers";

// Direct client call
const chats = await chatApi.getChats();

// React Query hook
const { data, isLoading } = useLawyers({ status: "submitted" });
```

## Error Handling

Errors are normalized through `@mah/client`'s error utilities and `@mah/api`'s axios interceptor. API error bodies follow a consistent `{ success, message, code }` shape; handle them via the shared error components/config in `@mah/client` and `@mah/ui`.
