# Mahakama: Legal Knowledge for Everyone

**Mahakama** (Swahili/Arabic for "Court") is an AI-powered legal empowerment platform built to demystify the law in South Sudan and Uganda. We deliver instant, plain-language answers to real-life legal questions, empowering citizens to understand their rights before they ever need a lawyer.

## The Mission

Legal knowledge is a right, not a privilege. In South Sudan and Uganda, accessing legal information is often expensive and confusing. Mahakama bridges this gap by providing free, easy-to-understand legal information in everyday language, helping users resolve questions independently or connect with vetted professionals when representation is necessary.

## Key Features

- **🔍 Everyday Language Search:** Ask real-life questions and receive answers mapped directly to specific legal statutes.
- **📚 Verified Legal Database:** Direct access to up-to-date, versioned legal texts, including the National Constitution, Criminal Code, and Landlord/Tenant Acts.
- **⚖️ Professional Connection:** Connect with vetted legal professionals for complex representation.

## How It Works

1. **Ask Your Question** - Describe your legal situation in everyday language:
   - "My landlord changed the locks without notice"
   - "My employee quit without giving notice"
   - "My neighbor is building on my property"
   - "I was unfairly dismissed from work"

2. **Get Clear, Verifiable Answers** - Our AI:
   - References the exact laws, sections, and subsections
   - Provides both simplified explanations and direct quotes from the legal text
   - Shows the official version and effective date of each law referenced
   - Links to the full legal document for verification

3. **Take Action** - Get guidance on:
   - How to resolve the issue yourself
   - What documents you might need
   - When to consider professional legal help

4. **Connect with a Lawyer** - Only if your situation requires:
   - Court representation
   - Complex legal documents
   - Specialized legal advice

## Project Structure

This repository is an npm-workspaces monorepo. Application entry points live in `apps/`, and shared source packages live in `packages/`.

### Apps

| Directory        | Description                                                                  |
| ---------------- | ---------------------------------------------------------------------------- |
| `apps/frontend`  | The public-facing React web interface for users (React Router 7 SSR + Vite). |
| `apps/api`       | The Express.js backend and AI-driven legal analysis engine.                  |
| `apps/admin`     | The internal admin console for reviewing and managing content (React Router 8 SSR). |

### Packages

| Directory                            | Description                                                          |
| ------------------------------------ | -------------------------------------------------------------------- |
| `packages/client` (`@mah/client`)    | Shared client primitives: i18n config, nav/routing, error handling.  |
| `packages/api` (`@mah/api`)          | TypeScript API client generated from the backend OpenAPI spec + hooks. |
| `packages/ui` (`@mah/ui`)            | Shared design system and UI components (shadcn/ui based).            |
| `packages/eslint-config`             | Shared ESLint presets.                                               |
| `packages/typescript-config`         | Shared TypeScript configs.                                           |

### Infrastructure

| Directory | Description                                                  |
| --------- | ------------------------------------------------------------ |
| `infra/`  | Dockerfiles and `docker-compose.yml` for local services.     |

## Getting Started

- Node v22.14.0 (`.nvmrc`).
- `npm install` (no lockfiles are committed).
- `npm run dev` runs both `apps/api` (`:3000`) and `apps/frontend` (`:5173`) concurrently.
- `npm run lint`, `npm run format`, and `npm run build` cover all workspaces.

## Contributing

We welcome contributions to make legal knowledge more accessible across East Africa. Whether you are a developer, legal expert, or community advocate, please check the [Contributing Guide](./CONTRIBUTING.md) to get started.
