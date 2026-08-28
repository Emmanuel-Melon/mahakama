# AGENTS.md

## Overview

`@mah/feature` is a shared package of framework-coupled feature modules consumed by both `apps/frontend` and `apps/admin`. Each feature lives under `src/<feature>/` as a self-contained directory (screens, components, types, utils). This package intentionally owns the React UI for shared features while leaving app-specific concerns (route page `*.tsx` glue, error boundaries, SSR loaders, i18n JSON) in the consuming apps.

## Exports

Declared via `exports` in `package.json`:

- `@mah/feature` → `src/index.ts` (barrel re-exporting every feature)
- `@mah/feature/auth` → `src/auth/index.ts` (per-feature barrel)

Consumers import subpaths, e.g. `import { LoginScreen } from "@mah/feature/auth"`.

## Adding a new feature

Create `src/<feature>/` mirroring the `auth` layout: an `index.ts` barrel plus `screens/`, `components/`, and any `<feature>.types.ts`/`utils.ts`. Wire the feature's barrel into the root `src/index.ts`. Consumers reach it via `@mah/feature/<feature>`.

## Conventions

- Each feature is app-agnostic: use **relative** imports within the feature (no `~/` alias) and only depend on `@mah/ui`, `@mah/api`, `@mah/client`, and public packages (`react`, `react-router`, `react-i18next`, `react-hook-form`, `@hookform/resolvers`, `zod`, `lucide-react`, `sonner`).
- Do NOT import from a consuming app (`~/...`) or reference app-internal modules (`~/lib/errors`, `~/context`, `~/components/RootErrorBoundary`). Route scaffold files (`routes/**`) and the i18n JSON live in the apps.
- Use deep imports for `@mah/ui` (e.g. `@mah/ui/components/Button`) and `@mah/api` (e.g. `@mah/api/src/clients/auth.api`, `@mah/api/src/hooks/use-auth`).
- If a shared screen needs an app-provided value (e.g. a route path), expose it as a prop with a sensible default rather than importing app config.
- No test script; consumers verify via the app-level `npm run typecheck`.
