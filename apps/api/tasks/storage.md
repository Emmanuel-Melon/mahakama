# Storage — Current State & Plan

> Living plan for replacing Supabase object storage with a local-filesystem storage layer. This is cross-cutting infra; the document write-path it feeds is covered in [`ingestion.md`](./ingestion.md). Entry point: [`README.md`](./README.md).
>
> Status legend: ✅ complete · 🟡 partial · ❌ stub/broken · 🔴 dead code (unused or references missing modules)
>
> All paths are relative to `api/`.

---

## 1. Current State (local filesystem)

Supabase has been fully removed. Uploaded files live on local disk under `uploads/` and are served publicly at `/uploads`.

| File                                                                             | Status | Notes                                                                                                                                                                                                                                                                                                                                                                                                                           |
| -------------------------------------------------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/lib/storage/storage.ts`                                                     | ✅     | `ensureStorageDir()` (creates `uploads/` + `uploads/samples/`); `saveUploadedFile({ buffer, fileName, mimeType })` → writes `uploads/<timestamp>-<sanitized-name>`, returns `{ storagePath, publicUrl }` (`publicUrl = ${serverConfig.baseUrl}/uploads/<file>`); `getStoragePath(urlOrPath)` (strips baseUrl + `/uploads/` prefix, traversal-guarded via `path.resolve` + prefix check); `readStoredFile(urlOrPath)` → `Buffer` |
| `src/lib/storage/samples.ts`                                                     | ✅     | `generateSamples()` — 2 minimal valid PDFs (`landlord-tenant-act-2022.pdf`, `constitution-of-uganda.pdf`) generated into `uploads/samples/` if missing; xref-offset-correct, no new dependencies                                                                                                                                                                                                                                |
| `src/feature/documents/controllers/ingest-document.controller.ts`                | ✅     | `saveUploadedFile` → `createDocument` with `publicUrl`; `bucketName` dropped from body destructuring                                                                                                                                                                                                                                                                                                                            |
| `src/feature/documents/controllers/create-document.controller.ts`                | ✅     | `storageUrl` normalization: `http(s)://` left as-is, `/`-relative prefixed with `serverConfig.baseUrl`, otherwise `https://`                                                                                                                                                                                                                                                                                                    |
| `src/feature/documents/controllers/download-document.controller.ts`              | ✅     | Fire-and-forget parse → `parsePdfFromPath(getStoragePath(storageUrl))` wrapped in try/catch                                                                                                                                                                                                                                                                                                                                     |
| `src/feature/documents/jobs/documents.jobs.ts`                                   | 🟡     | Reads locally via `parsePdfFromPath(getStoragePath(storageUrl))` (still behind disabled worker + `@/services` import + `chunkDocument` stub — see `ingestion.md`)                                                                                                                                                                                                                                                               |
| `src/feature/documents/operations/documents.ingest.ts`                           | 🔴     | Dead (never imported); `runBulkImport()` + `ingestDocument()` now use `saveUploadedFile` (kept + adapted)                                                                                                                                                                                                                                                                                                                       |
| `src/config/index.ts`, `src/config/config.types.ts`, `src/config/test.config.ts` | ✅     | `StorageConfigSchema { dir }`; `storageConfig` (`UPLOADS_DIR`, default `uploads` / `uploads-test`); `platformConfig`/Supabase removed                                                                                                                                                                                                                                                                                           |
| `src/middleware/index.ts`                                                        | ✅     | `app.use("/uploads", express.static(path.resolve(storageConfig.dir)))` — public, registered before the auth-guarded `/api` router; `ensureStorageDir()` on boot                                                                                                                                                                                                                                                                 |
| `src/feature/documents/documents.seed.ts`                                        | ✅     | `generateSamples()` then inserts with `storageUrl = ${serverConfig.baseUrl}${doc.storageUrl}`                                                                                                                                                                                                                                                                                                                                   |
| `src/feature/documents/documents.constants.ts`                                   | ✅     | 2 seed documents point at relative `/uploads/samples/<file>`                                                                                                                                                                                                                                                                                                                                                                    |
| `api/package.json`                                                               | ✅     | `@supabase/supabase-js` removed                                                                                                                                                                                                                                                                                                                                                                                                 |
| `.gitignore`                                                                     | ✅     | `uploads/` + `uploads-test/` ignored                                                                                                                                                                                                                                                                                                                                                                                            |
| `src/lib/supabase/`                                                              | ✅     | Deleted                                                                                                                                                                                                                                                                                                                                                                                                                         |

### 1.1 `storageUrl` semantics today

- Absolute URL `<baseUrl>/uploads/<file>`, stored in `documents.storage_url`.
- Consumers:
  - `src/feature/documents/jobs/documents.jobs.ts` — `parsePdfFromPath(getStoragePath(storageUrl))` (job broken + worker disabled).
  - `src/feature/documents/controllers/download-document.controller.ts` — fire-and-forget `parsePdfFromPath(getStoragePath(storageUrl))` after responding, try/catch + log.
  - Frontend — uses `document.storageUrl` directly as a browser href (`document-details-header.tsx` download link, `document-card.tsx` view/download handlers). **Constraint: `storageUrl` must remain an absolute, publicly fetchable URL.**

---

## 2. Target Design (local filesystem) — implemented

### 2.1 Layout

```
api/uploads/               ← STORAGE_DIR (config: UPLOADS_DIR, default "uploads")
  <timestamp>-<name>.pdf   ← uploaded files (flat, sanitized name)
  samples/                 ← seed fixtures (generated, gitignored)
```

### 2.2 Module `src/lib/storage/storage.ts`

- `ensureStorageDir()` — create `STORAGE_DIR` (+ `samples/`) on boot/seed.
- `saveUploadedFile({ buffer, fileName, mimeType })` → writes `uploads/<timestamp>-<sanitized-name>`, returns `{ storagePath, publicUrl }` where `publicUrl = ${serverConfig.baseUrl}/uploads/<file>`.
- `getStoragePath(urlOrPath)` → strips `serverConfig.baseUrl` + `/uploads/` prefix, resolves to an absolute path **inside `STORAGE_DIR`** (path-traversal guarded via `path.resolve` + prefix check).
- `readStoredFile(urlOrPath)` → `Buffer` (for PDF parse / future download endpoint).

### 2.3 `src/lib/storage/samples.ts`

Generates 2 minimal valid PDFs (`landlord-tenant-act-2022.pdf`, `constitution-of-uganda.pdf`) into `uploads/samples/` if missing — xref-offset-correct, no new dependencies.

### 2.4 PDF parsing

`src/lib/pdf-parse/index.ts`: `parsePdfFromPath(filePath)` (disk read). `parsePdfFromUrl` kept for external http(s) URLs (e.g. `POST /v1/documents` with a remote `storageUrl`).

### 2.5 Config

- `src/config/config.types.ts`: `StorageConfigSchema { dir: string }` (replaces `SupabaseConfigSchema` + `PlatformConfigSchema`).
- `src/config/index.ts`: `storageConfig` (`UPLOADS_DIR` env, default `uploads`).
- `src/config/test.config.ts`: same swap (test dir default `uploads-test`).

### 2.6 Serving

`src/middleware/index.ts`: `app.use("/uploads", express.static(path.resolve(storageConfig.dir)))` — **public**, registered before the auth-guarded `/api` router (browsers/worker fetch `storageUrl` directly). `ensureStorageDir()` called at boot.

### 2.7 Seeds

- `documents.constants.ts` stores relative paths (`/uploads/samples/<file>`).
- `documents.seed.ts` calls `generateSamples()`, then prepends `serverConfig.baseUrl` when inserting `storageUrl`.

### 2.8 Decisions (locked)

1. Seed documents → **local sample fixtures** (generated into `uploads/samples/`).
2. `operations/documents.ingest.ts` → **keep + adapt** to local storage.
3. Serving → **`/uploads` + `serverConfig.baseUrl`** (frontend unchanged, absolute URLs preserved).

---

## 3. Implementation tasks

> All phases complete. Order reflects the implementation sequence; each phase was independently verifiable.

### Phase A — Config & storage lib

- [x] **S1.1** `config.types.ts`: replace `SupabaseConfigSchema`/`PlatformConfigSchema` with `StorageConfigSchema { dir }`.
- [x] **S1.2** `config/index.ts` + `test.config.ts`: `storageConfig` export (`UPLOADS_DIR`, default `uploads` / `uploads-test`).
- [x] **S1.3** Create `src/lib/storage/storage.ts` (`ensureStorageDir`, `saveUploadedFile`, `getStoragePath` with traversal guard, `readStoredFile`).
- [x] **S1.4** Create `src/lib/storage/samples.ts` (2 minimal valid PDFs, generate-if-missing).
- [x] **S1.5** Add `parsePdfFromPath` to `src/lib/pdf-parse/index.ts`.

### Phase B — Serving

- [x] **S2.1** Mount `express.static(storageConfig.dir)` at `/uploads` in `src/middleware/index.ts` (before auth).

### Phase C — Wire uploads

- [x] **S3.1** `ingest-document.controller.ts`: `uploadFileToBucket` → `saveUploadedFile`; drop `bucketName` from body destructuring.
- [x] **S3.2** `download-document.controller.ts`: fire-and-forget parse → `parsePdfFromPath(getStoragePath(storageUrl))`, wrapped in try/catch.
- [x] **S3.3** `documents.jobs.ts`: `parsePdfFromUrl` → local read via `parsePdfFromPath` (still behind disabled worker; consistent for Phase I of `ingestion.md`).
- [x] **S3.4** `operations/documents.ingest.ts`: swap `uploadPublicDocument`/`uploadFileToBucket` → `saveUploadedFile`.
- [x] **S3.5** `create-document.controller.ts`: normalize `storageUrl` — `http(s)://` as-is, `/`-relative → `serverConfig.baseUrl` prefix, else `https://`.

### Phase D — Seeds

- [x] **S4.1** `documents.constants.ts`: storageUrl → relative `/uploads/samples/<file>`.
- [x] **S4.2** `documents.seed.ts`: ensure fixtures + prepend `serverConfig.baseUrl` to `storageUrl`.

### Phase E — Cleanup

- [x] **S5.1** Delete `src/lib/supabase/`.
- [x] **S5.2** Remove `@supabase/supabase-js` from `api/package.json` (`npm install` run manually by the user).
- [x] **S5.3** `.gitignore`: add `uploads/`, `uploads-test/`.

### Phase F — Docs & verification

- [x] **S6.1** Update `tasks/README.md`, `tasks/ingestion.md`, `tasks/rag.md` — Supabase → local filesystem (write-path diagram, tables, verification steps).
- [x] **S6.2** Manual verification checklist (see §4).

---

## 4. Verification (manual)

Run by the user after the code changes are made:

```bash
npm install      # api (removes @supabase/supabase-js)
npm run typecheck   # api + frontend
npm run lint        # all workspaces
```

Runtime smoke test (API running):

1. `npm run seed` (or `db:reset && npm run seed`) — creates `uploads/samples/*.pdf`.
2. `POST /v1/documents/ingest` (multipart, auth via Swagger) — file lands in `api/uploads/`, response `storageUrl` is `<baseUrl>/uploads/<file>`.
3. `GET /uploads/<file>` — serves the file.
4. `GET /v1/documents` — seed documents return `storageUrl` prefixed with `serverConfig.baseUrl`.

## Out of scope / notes

- No multer size/type limits (existing `memoryStorage`).
- Download-count increment is not tied to actual file downloads (pre-existing gap).
- CORS: `corsMiddleware` allows `localhost:5173` only — anchor-based downloads need no CORS, but browser fetches of `/uploads/*` from other origins (e.g. Netlify prod) would be blocked. Pre-existing; revisit with auth-protected downloads.
- Future: S3/object-store swap, auth-protected downloads, content hashing/dedup.
