# AGENTS.md

## Overview

`@mah/ui` is the shared design system and component library (shadcn/ui based) consumed by `apps/frontend` and `apps/admin`. It exposes React components, hooks, lib utilities, and global styles.

## Exports

Declared via `exports` in `package.json`:

- `.` → `src/index.ts` (barrel)
- `./globals.css` → `src/globals.css`
- `./lib/*` → `src/lib/*.ts`
- `./components/*` → `src/components/*.tsx`
- `./hooks/*` → `src/hooks/*.ts`

`main`/`types` point at `src/index.ts`. `type: "module"`; CSS is a declared side effect.

## Organization

`src/components/` is split into:

- **Top-level primitives** — shadcn/ui-style components (e.g. `Button.tsx`, `Card.tsx`, `Input.tsx`, `dialog.tsx`, `dropdown-menu.tsx`, `sidebar.tsx`, `badge.tsx`, `switch.tsx`).
- `atoms/` — small standalone elements (e.g. `CallToAction.tsx`, `BookmarkButton.tsx`, `MahCard.tsx`, `NavigationLoader.tsx`).
- `molecules/` — composed primitives (e.g. `SearchBar.tsx`, `PageError.tsx`, `PageLoading.tsx`, `FilterSelect.tsx`, `LanguageSwitcher.tsx`, `SidebarNav.tsx`).
- `organisms/` — larger composites grouped by concern: `async-state/` (`EmptyState`, `LoadingState`, `ErrorState`), `layout/` (`AppShell`, `PageHeader`, `SiteHeader`, `AuthLayout`), `list/`, `tutorial/`, `www/` (marketing).
- `errors/` — error-state components (`ErrorBoundary`, `NotFoundError`, `ServerError`, `SessionExpiredError`, `useAppError`).
- `ui/` — app-specific UI bits (`CardWithLabel`, `specialization-button`, `hero-section-action`).

Support: `src/lib/utils.ts` (`cn` helper), `src/hooks/use-mobile.ts`, `src/globals.css` (Tailwind v4 entry).

## Conventions

- Re-export everything needed by apps from `src/index.ts`; keep the barrel up to date when adding components.
- Radix primitives, `class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react`, and `sonner` are the standard building blocks.
- Tailwind v4 (`@tailwindcss/vite`) + `tw-animate-css`; apps import `@mah/ui/globals.css`.

## Peer dependencies

Requires the consumer to provide `@mah/api`, `@mah/client`, `react`, `react-dom`, and `react-router`. Do not add these as `dependencies`.

## Verification

`npm run typecheck` (tsc --noEmit) and `format`/`format:check` (prettier) are available in this workspace; TS is validated at the app level via `npm run typecheck`.
