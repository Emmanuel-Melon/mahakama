# Document Upload - Implementation Progress

**Feature:** Document Upload for Legal Analysis
**Spec:** `apps/api/specs/document-upload.md`
**Started:** 2026-08-18
**Completed:** 2026-08-18 (Phases 1-4)

---

## Phase 1: Data Layer ✅

- [x] Create user document session schema (if needed for metadata tracking)
- [x] Define TypeScript types for user document upload/response
- [x] Add ChromaDB collection naming utility for session-scoped documents

**Files created/modified:**

- `apps/api/src/feature/documents/documents.types.ts`
- `apps/api/src/lib/chroma/chroma.config.ts` (added collection naming utilities)

---

## Phase 2: Business Logic (Operations) ✅

- [x] Implement user document upload operation (parse, chunk, embed, store in session collection)
- [x] Implement user document status check operation
- [x] Implement user document deletion operation
- [x] Modify RAG context building to include user document collection when present
- [x] Implement session TTL cleanup job (BullMQ)

**Files created/modified:**

- `apps/api/src/feature/documents/operations/documents.process.ts`
- `apps/api/src/feature/documents/operations/documents.rag.ts`
- `apps/api/src/service/rag-service/rag.context.ts` (modified for hybrid search)
- `apps/api/src/feature/documents/jobs/documents.cleanup.ts`
- `apps/api/src/feature/documents/jobs/documents.worker.ts`
- `apps/api/src/feature/documents/jobs/documents.queue.ts`
- `apps/api/src/feature/documents/documents.config.ts`

---

## Phase 3: HTTP Layer (Controllers/Routes) ✅

- [x] Create upload user document controller (SSE streaming)
- [x] Create get user document status controller
- [x] Create delete user document controller
- [x] Add routes to session router
- [x] Modify existing message creation to handle user document context

**Files created/modified:**

- `apps/api/src/feature/documents/controllers/upload-document.controller.ts`
- `apps/api/src/feature/documents/controllers/get-document-status.controller.ts`
- `apps/api/src/feature/documents/controllers/delete-document.controller.ts`
- `apps/api/src/feature/documents/documents.routes.ts`
- `apps/api/src/routes/index.ts` (added user documents routes)

---

## Phase 4: Frontend Integration ✅

- [x] Update chat UI to support document upload
- [x] Display upload progress via SSE
- [x] Show document status indicator in chat
- [x] Update message display to show source attribution

**Files created/modified:**

- `packages/api/src/clients/documents.api.ts` (new API client)
- `packages/api/src/hooks/documents/use-documents.ts` (new hooks)
- `apps/frontend/app/feature/chats/components/chat-input.tsx` (added file upload)
- `apps/frontend/app/feature/chats/components/DocumentIndicator.tsx` (new component)
- `apps/frontend/app/feature/chats/components/CitationsSidebar.tsx` (source attribution)
- `apps/frontend/app/feature/chats/screens/ChatScreen.tsx` (integrated document status)

---

## Phase 5: Testing & Polish (Manual)

_Phase 5 will be completed manually by the development team._

- [ ] Unit tests for operations
- [ ] Integration tests for endpoints
- [ ] Test cleanup job
- [ ] Test hybrid context building

---

## Notes

- **Session TTL:** 24 hours (full day access)
- **Collection naming:** `user_docs_{sessionId}`
- **Context approach:** Hybrid (always include user doc, indicate source)
- **Future:** User-scoped documents (premium tier), multi-document upload

---

## API Endpoints

| Method   | Path                                   | Description                       |
| -------- | -------------------------------------- | --------------------------------- |
| `POST`   | `/api/v1/sessions/:sessionId/document` | Upload user document (SSE stream) |
| `GET`    | `/api/v1/sessions/:sessionId/document` | Get document status               |
| `DELETE` | `/api/v1/sessions/:sessionId/document` | Delete user document              |

---

## Frontend Components

| Component               | Location                                                               | Description                      |
| ----------------------- | ---------------------------------------------------------------------- | -------------------------------- |
| `ChatInput`             | `apps/frontend/app/feature/chats/components/chat-input.tsx`            | Updated with file upload support |
| `DocumentIndicator` | `apps/frontend/app/feature/chats/components/DocumentIndicator.tsx` | Shows attached document status   |
| `CitationsSidebar`      | `apps/frontend/app/feature/chats/components/CitationsSidebar.tsx`      | Updated with source attribution  |

---

## Testing the Implementation

### Backend Testing

1. **Start the API server:**

   ```bash
   cd apps/api
   npm run dev
   ```

2. **Test document upload (using curl):**

   ```bash
   curl -X POST http://localhost:3000/api/v1/sessions/{sessionId}/document \
     -H "Authorization: Bearer {token}" \
     -F "file=@/path/to/document.pdf"
   ```

3. **Test document status:**

   ```bash
   curl -X GET http://localhost:3000/api/v1/sessions/{sessionId}/document \
     -H "Authorization: Bearer {token}"
   ```

4. **Test document deletion:**
   ```bash
   curl -X DELETE http://localhost:3000/api/v1/sessions/{sessionId}/document \
     -H "Authorization: Bearer {token}"
   ```

### Frontend Testing

1. **Start the frontend dev server:**

   ```bash
   cd apps/frontend
   npm run dev
   ```

2. **Test the flow:**
   - Navigate to `/chats/new`
   - Create a new chat
   - In the chat screen, click the upload button (paperclip icon)
   - Upload a PDF document
   - See the document indicator showing upload progress
   - Ask questions about the document
   - Verify citations show source attribution (Your Document vs Legal Corpus)

---

## User Flow Summary

1. **User creates a new chat** → ChatScreen loads with ChatInput
2. **User uploads a document** → Click paperclip icon → Select PDF → Upload via SSE
3. **Upload progress displayed** → Progress bar shows in ChatInput
4. **Document indicator appears** → Shows uploaded filename and chunk count
5. **User asks questions** → System searches both user document and legal corpus
6. **Response includes sources** → Citations sidebar shows "Your Document" and "Legal Corpus" sections
7. **Document auto-expires** → 24-hour TTL, cleanup job removes collection
