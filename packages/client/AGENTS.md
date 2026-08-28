# AGENTS.md

## Overview

`@mah/client` is a framework-agnostic package of shared client primitives consumed by both `apps/frontend` and `apps/admin`. It has no UI dependencies — it provides types and logic only.

## Exports

Declared via `exports` in `package.json`:

- `@mah/client/i18n` → `src/i18n/`
- `@mah/client/nav` → `src/nav/`
- `@mah/client/errors` → `src/errors/`

Consumers import subpaths, e.g. `import type { I18nConfig } from "@mah/client/i18n"`.

## `i18n/`

Primitives for per-feature i18n configs.

- `i18n.types.ts` — `I18nConfig<TNamespace, TResources>`: `{ namespace, resources: { en, ar } }`.
- `i18n.core.ts` — an aggregator that merges an array of `I18nConfig`s into an i18next `Resource` map.

Usage: a feature `*Config.ts` exports `I18nConfig` built from `locales/{en,ar}/<feature>.json` (see the Admin/Frontend AGENTS.md). The app's `app/lib/i18n/index.ts` passes feature configs to the aggregator.

## `nav/`

Typed routing helpers used by feature route configs.

- `nav.types.ts` — route/path types.
- `nav.core.ts` — `defineRoutes(...)` used by feature Configs to declare route entries.
- `nav.paths.ts` / `nav.utils.ts` — route-to-path resolution helpers (e.g. `routes.to` for typed paths).

## `errors/`

Unified error configuration and utilities.

- `errors.types.ts` — error types.
- `errors.config.ts` — central error config.
- `errors.utils.ts` — helpers for mapping/normalizing errors.

## Conventions

- File-style: `<module>.<kind>.ts` with a barrel `index.ts` (e.g. `nav.core.ts`, `nav.types.ts`, `nav.utils.ts`).
- Keep this package free of UI/framework (React) dependencies so both apps and `@mah/ui` can depend on it.
- No test script; consumers verify via the app-level `npm run typecheck`.
