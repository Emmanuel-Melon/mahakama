# Chunk Metadata, Versioning & Amendment Tracking — Current State & Backlog

> Living plan for keeping the legal corpus **fresh and versioned**. Laws change; a RAG system with stale data is dangerous. This covers: real `last_updated` dates, versioned chunks, scheduled diff checks against law sources, flagging outdated answers, and (future) Akoma Ntoso `<amendment>` parsing. This is a **write-path / lifecycle** plan; the citation model it feeds is covered in [`citations.md`](./citations.md). Entry point: [`README.md`](./README.md).
>
> Status legend: ✅ complete · 🟡 partial · ❌ stub/broken · 🔴 dead code (unused or references missing modules) · 🗑 deleted
>
> All paths are relative to `api/`.

---

## 1. Current State

| Area | Status | Notes |
| --- | --- | --- |
| `documents.lastUpdated` | ✅ | real `date` column, `YYYY-MM-DD` (U2) |
| Document/chunk versioning | ✅ | `documents.version` + `document_chunks.version`; chunk ids `law_<chunkId>-v<N>`; delete-old-keep-latest re-ingest policy (U1) |
| Chroma chunk metadata | ✅ | `id/title/content_length/imported_at/section/category/source/act_name/section_number/full_citation/url/jurisdiction/last_updated/version/document_id` (C1.3 + U1.2) |
| Law source adapters | ✅ | `src/service/law-sources/` — API + HTML `LawSourceClient` adapters, monthly diff-check scheduler (U3) |
| AKN (Akoma Ntoso) | ❌ | **No AKN/XML handling anywhere** in the repo — no parser, no `<amendment>` awareness, no source configured |
| Outdated-answer flagging | ✅ | retrieval marks `stale` (U4.1), prompt flags it (U4.3), UI notice (U4.4) |

---

## 2. Model

The shared per-chunk metadata model lives in [`citations.md`](./citations.md) §2. This doc adds the **lifecycle** fields and rules:

| Field | Purpose | Notes |
| --- | --- | --- |
| `documents.actName` | "Land Act, 2012" | fed to every chunk of the doc |
| `documents.jurisdiction` | "Uganda" | collection default ("Uganda", "South Sudan") |
| `documents.sourceUrl` | URL to the authoritative text | e.g. ULII; used by diff checks + citation links |
| `documents.version` | `int`, bumped on every re-ingest | the "diff check found a change" signal |
| `documents.lastUpdated` | **real date** of last amendment/ingest | replaces the varchar(4) year |
| chunk `version` | version of the document this chunk belongs to | written to Chroma + `document_chunks` |
| chunk `last_updated` | ISO date of the source text | shown in UI as "as of [date]" |

---

## 3. Backlog (one concern per phase)

### Phase 1 — Versioned chunk metadata
- [x] **U1.1** `documents.schema.ts`: added `actName text`, `jurisdiction text`, `sourceUrl text`, `version integer default 1 notNull`. New columns flow through `documentInsertSchema`/`req.validatedBody` (create-document) and are passed by the ingest controller when provided in the body.
- [x] **U1.2** Chunk ids are version-scoped in `embeddings.generate.ts`: `law_<chunkId>[-v<version>]` so re-ingesting a newer version **never collides** with old chunks. Writes `version` + `document_id` into Chroma metadata (`last_updated` was already wired in C1.3). `DocumentChunk` gained `version?`/`documentId?`; the ingest job handler stamps every chunk with the document's `version` + citation fields (`actName`, `jurisdiction`, `sourceUrl→url`, `lastUpdated`).
- [x] **U1.3** `document_chunks` (`embeddings.schema.ts`): added `version` (integer) alongside the C1.4 citation columns; `saveDocumentChunks` persists `version` (delete-then-insert per documentId keeps only the latest version's rows in Postgres).
- [x] **U1.4** Re-ingest policy decided: **delete old, keep latest** (default). New `chromaClient.deleteDocuments({ ids?, where? })`; the job handler deletes the previous version's chunks from Chroma (`where: { $and: [{ document_id }, { version: v-1 }] }`) after a successful embed when `version > 1`. Dormant until a re-ingest/version-bump path exists (U3) — uploads today always create version 1.

### Phase 2 — Real `last_updated` dates
- [x] **U2.1** Migrated `documents.lastUpdated` from `varchar(4)` year to a `date` column (mode `string`, values `YYYY-MM-DD`). Seed constants backfilled to `Jan 01 <year>` (`2022-01-01`, `1995-01-01`). `documentInsertSchema` gained a `.refine` enforcing the `YYYY-MM-DD` shape so bad dates return 400 instead of a Postgres error. Chunks now carry the full date as `last_updated` (Chroma + `document_chunks`), so "as of [date]" shows a real date.
- [x] **U2.2** "As of" caveat documented: for **uploaded PDFs** the amendment date is unknown — the ingest controller falls back to the **ingest date** (`new Date().toISOString().slice(0, 10)`). A verified amendment date (from U3 diff checks / AKN) overrides it. Frontend copy already renders `as of <date>`; consider distinguishing "as of [ingest date]" from "amended [date]" when U3 lands.

### Phase 3 — Monthly diff check (scheduled)
- [x] **U3.1** New `src/service/law-sources/` with a `LawSourceClient` interface (`check(documents)` → `SourceCheck[]`) and two adapters:
  - **API adapter** (`adapters/api.client.ts`, `UlIiApiLawSourceClient`) — fetches `GET {uliiBaseUrl}/acts`, diffs entries against tracked documents by `sourceUrl` or normalized title, and reports `new-act` for untracked entries / `reingest` for matched entries with a newer amendment date.
  - **HTML adapter** (`adapters/html.client.ts`, `HtmlLawSourceClient`) — fetches each document's `sourceUrl` page and scrapes the "Last Updated" footer (`law-source.scrape.ts`, pure + unit-tested) against the stored `lastUpdated`. Documents without a `sourceUrl` are skipped.
- [x] **U3.2** BullMQ repeatable job on the new `QueueName.Scheduled` (`law-sources.scheduler.ts` → `upsertJobScheduler`, monthly cron `0 0 1 * *`, default via `LAW_SOURCES_CRON`). `LawSourceJobHandler.handleDiffCheck` runs every registered client, records every check, and for each `reingest`: bumps `documents.version` + sets `lastUpdated` to the detected date, then **enqueues the existing `DocumentUploaded` job** (re-ingest worker; version-scoped ids + old-version Chroma cleanup from U1.4 make it safe).
- [x] **U3.3** Config: `LawSourceConfigSchema` in `src/config/config.types.ts` + `lawSourcesConfig` in `src/config/index.ts` (`LAW_SOURCES_ENABLED`, `ULII_BASE_URL`, `ULII_API_KEY`, `LAW_SOURCES_CRON`). `getLawSourceClients()` returns `[]` until `LAW_SOURCES_ENABLED=true` — the scheduled run then logs and no-ops.
- [x] **U3.4** Audit table `law_source_checks` (`documents.schema.ts`): client, document (nullable — untracked `new-act` rows), title, source URL, detected/previous `lastUpdated`, `action` (`no-change`/`reingest`/`new-act`/`detection-failed`), detail, `createdAt`. Persisted via `law-source.persistence.ts` for every check.

### Phase 4 — Flag outdated answers
- [x] **U4.1** At retrieval time (`rag.service.ts`): a single batched `loadDocumentVersions(documentIds)` query (`rag.documents.ts`) loads the current `version` of every cited document; `isChunkStale` (`rag.staleness.ts`, pure + unit-tested) flags a chunk `stale` when its `version` is older than the document's current version **or** its `last_updated` is older than a configurable window (default 24 months, `RAG_STALENESS_MONTHS` via new `RagConfigSchema`). Fail-open: no `document_id`/`last_updated` → never flagged.
- [x] **U4.2** `RAGSource`/`RAGChunk` gained `stale?: boolean` (`rag.types.ts`); propagated through `metadata.sources` on the assistant message, plus a top-level `metadata.hasStaleSources` flag in `rag.answer.ts`.
- [x] **U4.3** Prompt note (`rag.prompts.ts`): when any retrieved chunk is stale, the prompt lists the outdated passages (`citation (as of date)`) and instructs the LLM to add "This information is based on [act] as of [date]. A more recent amendment may exist." — without inventing amendment dates.
- [x] **U4.4** UI (`MessageBubble.tsx`): amber stale notice rendered under the Sources block (wired citations.md C5.4) listing each stale source and its as-of date. `RAGSource`/metadata typing added in `chat.api.ts`.

### Phase 5 — AKN (Akoma Ntoso) amendment tracking *(future)*
> AKN is the XML standard for legislation; amendments are often encoded as `<amendment>` tags. **No AKN source is configured today** — this phase is gated on that.
- [ ] **U5.1** Decide parser dependency (e.g. `fast-xml-parser`/`@xmldom`) — do not add until a source is confirmed. Config: AKN base URL per jurisdiction.
- [ ] **U5.2** Parse AKN: extract act title, section nodes, `<amendment>`/amendment date metadata; diff against stored chunks to find affected sections.
- [ ] **U5.3** Auto-update: for affected sections, re-chunk the amended text and re-embed **with a bumped document `version`**; unaffected sections keep their chunk ids.

---

## 4. Relationship to other plans

| Task | Overlaps with | Notes |
| --- | --- | --- |
| U1.1–U1.3 | citations.md C1.3–C1.4 | Same `act_name`/`last_updated`/`version` metadata; write-path is authoritative, retrieval consumes |
| U3.2 | ingestion.md Phase IV | Re-ingest reuses the existing `DocumentUploaded` worker; version-scoped ids (U1.2) make it safe |
| U4.2–U4.4 | citations.md C2.1, C5.4 | `stale`/`lastUpdated` ride the same `RAGSource` shape and Sources UI |

---

## 5. Verification

- `npm run typecheck` + `npm run lint` + `npm run test:unit` (api); `npm run build` (api).
- Schema: `npm run drizzle:push` after U1/U2 (DB reset currently means push applies the full schema).
- Scheduled job: with `LAW_SOURCES_ENABLED=true` (+ `ULII_BASE_URL`/`ULII_API_KEY`), run the repeatable job manually once via BullMQ dashboard to confirm the diff runs and enqueues a re-ingest on a changed `lastUpdated`; confirm `law_source_checks` rows were written.
- Manual: re-ingest a document after bumping its source text — confirm new chunk ids are `law_<id>-v<N>-...`, old version no longer retrievable (default U1.4), and an answer quoting that act shows the staleness notice.
