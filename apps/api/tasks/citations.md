# Citations & Source Metadata — Current State & Backlog

> Living plan for making citations a first-class part of every answer: a canonical citation metadata model, retrieval that returns it, post-generation validation, and a UI that renders sources. This is a **read-path** plan (metadata flows _out_ of Chroma); the write-path that populates that metadata and keeps it fresh is covered in [`metadata-updates.md`](./metadata-updates.md). Entry point: [`README.md`](./README.md).
>
> Status legend: ✅ complete · 🟡 partial · ❌ stub/broken · 🔴 dead code (unused or references missing modules) · 🗑 deleted
>
> All paths are relative to `api/`.

---

## 1. Current State

### 1.1 Citation metadata model

| File                                                 | Status | Notes                                                                                                                                                        |
| ---------------------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `src/service/rag-service/rag.types.ts`               | 🟡     | `RAGSource` = `{ id, title, category?, source?, section?, similarity }` — **no `url`, no `fullCitation`, no `actName`, no `jurisdiction`, no `lastUpdated`** |
| `src/service/embedding-service/embeddings.types.ts`  | 🟡     | `DocumentChunk` = `{ id, title, content, similarity?, section?, category?, source? }` — same gap                                                             |
| `src/service/embedding-service/embeddings.schema.ts` | 🟡     | `document_chunks` has `section`/`subsection`/`article_number` only — no `act_name`, `full_citation`, `url`, `jurisdiction`, `last_updated`                   |

### 1.2 Retrieval (read-path)

| File                                     | Status | Notes                                                                                                                                                                           |
| ---------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/service/rag-service/rag.service.ts` | 🟡     | `retrieveContext` maps Chroma metadata → `RAGChunk`/`RAGSource` reading only `title`/`section`/`category`/`source` (`:46-69`); dedupes by `title\|section`                      |
| `src/service/rag-service/rag.context.ts` | ✅     | `buildRagContext` — real context, degrade-to-empty on Chroma failure, history trim                                                                                              |
| `src/service/rag-service/rag.prompts.ts` | 🟡     | `buildRagChatPrompt` emits `[Title, Section]` inline citations (`:13-16`) and asks the LLM to "Cite specific laws and sections" — but nothing enforces a citation in the output |

### 1.3 Answer path & persistence

| File                                      | Status | Notes                                                                                                                                                                              |
| ----------------------------------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/service/rag-service/rag.answer.ts`   | 🟡     | `generateAssistantReply` persists `metadata.sources` (the `RAGSource[]`) on the assistant message (`:41`) — **the persistence seam already exists**; no post-generation validation |
| `src/feature/messages/messages.schema.ts` | ✅     | `chat_messages.metadata` jsonb — carries `sources` today                                                                                                                           |

### 1.4 Frontend

| File                                                      | Status | Notes                                                                                                   |
| --------------------------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------- |
| `frontend/app/feature/chats/components/MessageBubble.tsx` | ❌     | Renders markdown only; **never renders `message.metadata.sources`** despite the API returning them      |
| `frontend/app/lib/api/chat.api.ts`                        | 🟡     | `ChatMessage.metadata` typed as `{ replyStatus?, errorMessage? }` — no `sources`/`citationStatus` shape |
| `frontend/app/lib/api/generated/api.types.ts`             | 🟡     | `Message.metadata` is a loose union; regenerate after any schema change                                 |

### 1.5 Seed data

| File                                              | Status | Notes                                                                                                                                                                                                                                  |
| ------------------------------------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/service/rag-service/dataset/laws.dataset.ts` | 🟡     | Entries are `{ id, title, category, source, content }` — `source` _is_ a full citation ("Constitution of Uganda, Article 10"); `title` is a provision name, **not** an act name. Shape needs harmonizing with the canonical model (C1) |

---

## 2. Canonical Citation Model

Per-chunk metadata carried end-to-end (Chroma ↔ Postgres ↔ API ↔ UI):

| Field            | Example                          | Source of truth                                          |
| ---------------- | -------------------------------- | -------------------------------------------------------- |
| `act_name`       | `"Land Act, 2012"`               | documents.actName (see metadata-updates.md U1)           |
| `section_number` | `"Section 4(2)"`                 | chunk parse or document metadata                         |
| `full_citation`  | `"Land Act, 2012, Section 4(2)"` | derived `act_name, Section section_number` (or explicit) |
| `url`            | `https://ulii.org/...`           | documents.sourceUrl / storageUrl                         |
| `jurisdiction`   | `"Uganda"`                       | document metadata (default per collection)               |
| `last_updated`   | `2023-06-01`                     | documents.lastUpdated (see metadata-updates.md U2)       |
| `version`        | `3`                              | documents.version (see metadata-updates.md U1)           |

---

## 3. Backlog (one phase per layer)

### Phase 1 — Model & ingestion metadata

- [x] **C1.1** Extend `RAGSource` (`rag.types.ts`) with `fullCitation?: string`, `url?: string`, `actName?: string`, `jurisdiction?: string`, `lastUpdated?: string` (ISO date). Fields are optional initially (all existing construction sites omit them); they get populated from C1.3 onward and can be tightened to required once data flows.
- [x] **C1.2** Extend `DocumentChunk` (`embeddings.types.ts`) with the same fields (optional, omitted when unknown — Chroma rejects `undefined`). `RAGChunk` also carries the same five fields so the prompt/context can use them.
- [x] **C1.3** Extend Chroma metadata in `embeddings.generate.ts` (`:25-35`) to write `act_name`, `section_number`, `full_citation`, `url`, `jurisdiction`, `last_updated`. Existing keys (`title`, `section`, `category`, `source`) stay for backward compat with legacy chunks. **`version` deferred** to metadata-updates.md U1.2 (it belongs to the versioned-chunk id scheme, which is out of scope until C2.1).
- [x] **C1.4** Extend `document_chunks` schema (`embeddings.schema.ts`) with `act_name`, `full_citation`, `url`, `jurisdiction`, `last_updated` (date); `section_number` **reuses the existing `section` column** (same value, avoids duplication). `saveDocumentChunks` (`embeddings.persistence.ts`) persists the new fields. Apply with `npm run drizzle:push`. `version` column deferred to metadata-updates.md U1.3.
- [x] **C1.5** Harmonize `laws.dataset.ts`: new `LawEntry` type + `toLawDocument(law)` derives `actName`/`section`/`fullCitation`/`jurisdiction` from each entry's `source` string (e.g. `"Constitution of Uganda, Article 10"` → actName `Constitution of Uganda`, section `Article 10`). No URLs in the dataset, so `url` stays absent (don't fabricate). `import-laws-to-chroma.ts` now maps entries via `toLawDocument` and calls `generateDocumentEmbeddings`, so seeds carry the full citation field set.

### Phase 2 — Retrieval returns metadata

- [x] **C2.1** `rag.service.ts` `retrieveContext`: reads and maps `full_citation`, `url`, `act_name`, `jurisdiction`, `last_updated` from Chroma metadata into `RAGSource`/`RAGChunk`; absent fields stay `undefined` (legacy chunks degrade gracefully). Dedupe key now `fullCitation ?? title|section`. Added unit coverage in `rag.service.test.ts`.
- [x] **C2.2** `RAGChunk` carries `fullCitation` (and `url`/`actName`/`jurisdiction`/`lastUpdated`) so the prompt can use them (below) — type portion done in C1.2; mapping populated in C2.1.

### Phase 3 — Prompt cites the full citation

- [x] **C3.1** `buildRagChatPrompt`: each context block renders the `full_citation` (e.g. `Landlord and Tenant Act 2022, Section 3`) when present, falling back to `[Title, Section]` for legacy chunks; instruction 2 now tells the LLM to reproduce the citation string verbatim. Added unit coverage in `rag.prompts.test.ts`.

### Phase 4 — Post-generation validation (flag for review)

> Decision: **flag, don't reject.** A missing citation must never destroy a delivered answer. `citationStatus` is persisted on the assistant message and surfaced in the UI.

- [x] **C4.1** New `src/service/rag-service/rag.citations.ts`: `extractCitations(text)` scans for `Act,? \d{4}`, `Article \d+...`, `Sections? \d+...`, `s. \d+`, and `Constitution of Uganda`; returns `{ citations, hasCitation }` (deduped, case-insensitive).
- [x] **C4.2** `rag.answer.ts`: after `generateTextContent`, scans the reply and persists `metadata.citationStatus` (`"ok"` | `"missing"`) + `metadata.citations` alongside `sources`. The answer is always delivered — validation only flags.
- [x] **C4.3** Unit tests for `extractCitations` (positive/negative, ranges, subsections, shorthand, dedupe) — `rag.citations.test.ts`.

### Phase 5 — UI layer (first-class citations)

> Target render:
>
> ```
> Answer: A landlord must give 30 days' notice before eviction.
>
> Source: Land Act, 2012, Section 4(2)   [linked to url]
> Full text: "A landlord shall not evict a tenant without giving thirty days' written notice..."
> ```

- [x] **C5.1** `MessageBubble.tsx` (live path: `ChatScreen → MessageList`): when `message.metadata.sources` is non-empty on an assistant message, render a Sources block below the markdown — `Source:` full citation (hyperlink to `url`, `rel="noopener noreferrer"`), jurisdiction + "as of [lastUpdated]" caption, and the `Full text:` excerpt. `RAGSource` gained an optional `content` field (populated in `rag.service.ts`) to carry the excerpt end-to-end.
- [x] **C5.2** When `citationStatus === "missing"`, render a subdued amber notice: "No specific legal source was found for this answer — treat it as general information and verify with a lawyer."
- [x] **C5.3** Extend `ChatMessage.metadata` typing in `chat.api.ts` with `sources?: RAGSource[]`, `citationStatus?: "ok" | "missing"`, `citations?: string[]`; `RAGSource` mirrors the backend shape (incl. `content`). Regenerate generated types (`npm run generate:types` with backend running) to keep `api.types.ts` in sync.
- [x] **C5.4** Outdated-answer notice ("This information is based on the Land Act as of [date]. A more recent amendment may exist.") — rendered as an amber banner under the Sources block in `MessageBubble.tsx` when `metadata.hasStaleSources` (stale logic lives in metadata-updates.md U4: chunk `version` vs `documents` row + 24-month window, surfaced on `RAGSource.stale`).

---

## 4. Relationship to other plans

| Task      | Overlaps with                                | Notes                                                                                                             |
| --------- | -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| C1.1–C1.4 | metadata-updates.md U1/U2; ingestion.md I3.1 | Same metadata model; write-path (Chroma + `document_chunks`) is the source, read-path (retrieval) is the consumer |
| C1.5      | ingestion.md I5.1                            | Seed script must pass the extended fields                                                                         |
| C2.1      | rag.md T1.3 (`RAGSource`)                    | Retrieval mapping stays in `rag.service.ts`                                                                       |
| C5.3      | rag.md T1.2 (generated types)                | Regenerate `api.types.ts` after schema changes                                                                    |

---

## 5. Verification

- `npm run typecheck` + `npm run lint` + `npm run test:unit` (api); `npm run build` (api).
- DB schema change applied via `npm run drizzle:push` (see metadata-updates.md U1/U2).
- Manual: `npm run chroma:import-laws`, then ask a question in a chat — the assistant message `metadata` should include `sources` with `fullCitation`/`url`, and the Sources block should render in the UI.
