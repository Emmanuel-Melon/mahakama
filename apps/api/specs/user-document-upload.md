# User Document Upload for Legal Analysis

**Status:** Draft
**Date:** 2026-08-18
**Author:** Spec-first workflow (human + agent)

---

## 1. Problem Statement

Users need to understand how their personal legal documents (contracts, leases, policies) relate to relevant laws in our system. Currently, the ingestion pipeline only handles admin-uploaded system documents for the legal corpus. Users have no way to upload their own documents for analysis against this corpus.

**Goal:** Allow users to upload documents for analysis, with the system providing answers based on both the uploaded document and relevant legal documents in the system.

---

## 2. User Stories

1. As a user, I want to upload a contract/lease/policy so that I can understand how it relates to relevant laws.
2. As a user, I want to ask questions about my uploaded document so that I can get specific legal analysis.
3. As a user, I want the system to cite relevant laws when answering questions about my document so that I can verify the analysis.
4. As a user, I want my uploaded document to be automatically cleaned up so that my data doesn't persist unnecessarily.

**Scope:**

- Single document per session (multi-document deferred to future version)
- Session-scoped documents (user-scoped deferred to premium tier)

---

## 3. Entities & Actions

### Entities

| Entity             | Description                                                        | Data Model                                                                     |
| ------------------ | ------------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| **User Document**  | A PDF uploaded by a user for analysis in a specific session        | Separate collection in ChromaDB (`user_docs_{sessionId}`) + ephemeral metadata |
| **Document Chunk** | Parsed sections of the user's document with embeddings             | ChromaDB documents within the user's collection                                |
| **Chat Session**   | Existing entity, now with optional linked user document collection | Existing `chat_sessions` table + collection reference                          |
| **Legal Chunk**    | Existing entity from the legal corpus                              | Existing `document_chunks` + ChromaDB `legal_questions` collection             |

### Actions

| Action                       | Trigger                                         | Endpoint                                    | Description                                                     |
| ---------------------------- | ----------------------------------------------- | ------------------------------------------- | --------------------------------------------------------------- |
| **Upload User Document**     | User uploads PDF via chat UI                    | `POST /api/v1/sessions/:sessionId/document` | Parse, chunk, embed, store in session-scoped collection         |
| **Query with User Context**  | User sends message in session with uploaded doc | Existing `POST /api/v1/messages`            | Search user collection + legal corpus, generate combined answer |
| **Cleanup Session Document** | Session TTL expires (24 hours)                  | Background job (BullMQ)                     | Delete session-scoped collection and associated data            |
| **Check Document Status**    | UI needs to show upload/processing status       | `GET /api/v1/sessions/:sessionId/document`  | Return processing status of user document                       |

---

## 4. API Endpoints

| Method   | Path                                   | Purpose                                                                             |
| -------- | -------------------------------------- | ----------------------------------------------------------------------------------- |
| `POST`   | `/api/v1/sessions/:sessionId/document` | Upload user document for analysis (returns SSE stream for processing status)        |
| `GET`    | `/api/v1/sessions/:sessionId/document` | Get user document status (processing/completed/failed) + metadata                   |
| `DELETE` | `/api/v1/sessions/:sessionId/document` | Manually delete user document before TTL expiry                                     |
| `POST`   | `/api/v1/messages`                     | _Existing endpoint_ — now searches user document collection when present in session |

---

## 5. User Flow

### Happy Path

1. User creates a new chat session (existing flow)
2. User uploads a document via chat UI → `POST /api/v1/sessions/:sessionId/document`
3. System parses PDF, chunks, embeds, stores in `user_docs_{sessionId}` collection
4. SSE streams progress: `started → progress → completed`
5. User asks questions about the document
6. System searches both `user_docs_{sessionId}` AND `legal_questions` collections
7. System generates answer with citations, clearly indicating source (user document vs. legal corpus)
8. Repeat steps 5-7 for follow-up questions
9. Session expires after 24-hour TTL → background job deletes collection

### Unhappy Paths

- **Upload fails (invalid PDF):** Return error via SSE, no collection created
- **No legal context found:** System responds with "I can analyze your document, but I couldn't find relevant legal provisions for this question"
- **No user document context found:** System responds using only legal corpus (if question is general)
- **Processing timeout:** Collection marked as failed, user can retry upload

---

## 6. Decisions & Constraints

| Decision                  | Choice                                            | Rationale                                                                    |
| ------------------------- | ------------------------------------------------- | ---------------------------------------------------------------------------- |
| **Document scope**        | Session-scoped                                    | Prevents contamination of legal corpus; user-scoped deferred to premium tier |
| **Context inclusion**     | Hybrid (always include user doc, indicate source) | Simpler UX, better transparency                                              |
| **Cleanup mechanism**     | Session TTL (24 hours)                            | Automatic, no user action required                                           |
| **Collection naming**     | `user_docs_{sessionId}`                           | Isolates each session's documents                                            |
| **Processing**            | Async via BullMQ                                  | Consistent with existing ingestion pipeline, supports SSE progress streaming |
| **Multi-document**        | Single document per session (v1)                  | Reduces complexity; multi-doc deferred to future version                     |
| **Embedding model**       | Same as legal corpus (nomic-embed-text)           | Consistent vector space for hybrid search                                    |
| **Query top_k**           | Increase from 5 to 10 when user document present  | Ensure enough context from both sources                                      |
| **Staleness checks**      | Skip for user documents                           | User documents are ephemeral, no versioning needed                           |
| **User document storage** | Separate ChromaDB collection only                 | No PostgreSQL storage needed for ephemeral documents                         |

---

## 7. Technical Implementation Details

### Collection Management

- **Collection naming:** `user_docs_{sessionId}`
- **Metadata per chunk:** `{ content, chunkIndex, sessionId, uploadedAt }`
- **TTL:** 24 hours from upload
- **Cleanup:** BullMQ job checks for expired collections and deletes them

### RAG Context Building (Modifications to Existing System)

When a user message is sent in a session with an uploaded document:

1. **Check for user document collection** — Query ChromaDB for `user_docs_{sessionId}` collection existence
2. **If exists:** Search both collections with increased `top_k` (10 instead of 5)
3. **Merge results:** Combine and re-rank chunks from both sources
4. **Build prompt:** Include source indicators (`[USER DOCUMENT]` vs `[LEGAL CORPUS]`) in context
5. **Generate response:** LLM answers with clear source attribution

### SSE Events (User Document Upload)

```
started → progress (per batch) → completed | error
```

Events emitted via `documents.progress.ts` EventEmitter (reuse existing infrastructure).

### Background Cleanup Job

BullMQ job runs every hour:

1. Query ChromaDB for collections matching `user_docs_*` pattern
2. Check `uploadedAt` metadata against TTL (24 hours)
3. Delete expired collections
4. Log cleanup activity

---

## 8. Future Considerations

### User-Scoped Documents (Premium Tier)

For future premium implementation:

**Changes required:**

1. Collection naming: `user_docs_{userId}` instead of `user_docs_{sessionId}`
2. Persistence: User documents persist across sessions until manually deleted or user deletes account
3. Management UI: New `/documents` route showing user's uploaded documents with delete capability
4. Privacy: Ensure user can only query their own collections (add userId filter to ChromaDB queries)
5. Cleanup: Manual deletion only + optional account deletion cascade

**New endpoints (future):**

- `GET /api/v1/users/:userId/documents` — List user's uploaded documents
- `DELETE /api/v1/users/:userId/documents/:documentId` — Delete specific user document

### Multi-Document Upload

For future version:

- Allow multiple documents per session
- UI for selecting/activating specific documents for context
- Collection naming: `user_docs_{sessionId}_{documentId}`

---

## 9. Sign-Off

- [ ] Human confirms spec is correct
- [ ] Agent will build only what's in this spec
- [ ] Agent will ask before extending scope

---

**Next Steps:** Code implementation following this spec.
