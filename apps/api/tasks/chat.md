# Chat Domain — Current State & Backlog (Send/Reply Path)

> Living plan for the chat message flow: creating a chat, sending follow-up messages, and generating assistant replies. The RAG retrieval/prompt pieces are covered in [`rag.md`](./rag.md); the answer path (`generateAssistantReply`) is shared. This doc tracks making reply generation **asynchronous (BullMQ)** and unblocking the broken follow-up send.
> Status legend: ✅ complete · 🟡 partial · ❌ stub/broken · 🔴 dead code (unused or references missing modules) · 🗑 deleted
>
> All paths are relative to `api/` unless prefixed `frontend/`.
>
> Live flow today: `POST /v1/chats` or `POST /v1/messages` → save user msg → **synchronous** `generateAssistantReply` (best-effort, LLM failure swallowed) → 201. Frontend follow-up send is **broken** (C1.1).

---

## 1. Current State (by stack layer)

### 1.1 Data layer

| File                                      | Status | Notes                                                                                                                       |
| ----------------------------------------- | ------ | --------------------------------------------------------------------------------------------------------------------------- |
| `src/feature/chats/chats.schema.ts`       | ✅     | `chat_sessions` — id, `user_id`, title, metadata jsonb, created/updated_at. No ownership enforced at query time             |
| `src/feature/messages/messages.schema.ts` | ✅     | `chat_messages` — id, `chat_id` FK (cascade), content, `sender_type` enum, `user_id` FK nullable, timestamp, metadata jsonb |
| `src/feature/chats/chats.types.ts`        | ✅     | `chatSelectSchema` (drizzle-zod), `ChatSession`, `ChatsJobMap` (`ChatCreated`, `MessageSent` = `{ userId, messageId }`)     |
| `src/feature/messages/messages.types.ts`  | ✅     | `messageInputSchema` (chatId/content/senderType/userId/metadata), `ChatMessage`                                             |
| `src/feature/chats/shared.types.ts`       | ✅     | `SenderType` = user/assistant/system                                                                                        |

### 1.2 Operations / business logic

| File                                                 | Status | Notes                                                                       |
| ---------------------------------------------------- | ------ | --------------------------------------------------------------------------- |
| `src/feature/chats/operations/chats.create.ts`       | ✅     | `createChat` insert + returning                                             |
| `src/feature/chats/operations/chats.find.ts`         | ✅     | `getUserChats` (paginated), `getChatById` (includes `messages` relation)    |
| `src/feature/chats/operations/chats.list.ts`         | 🔴     | `listUserChats` — dead, imported by nothing                                 |
| `src/feature/chats/operations/chats.update.ts`       | 🔴     | `updateChat` unused (no PATCH route); `deleteChat` used                     |
| `src/feature/messages/operations/messages.create.ts` | ✅     | `sendMessage` — validates chat/user, inserts message (metadata persisted)   |
| `src/feature/messages/operations/messages.list.ts`   | ✅     | `getMessagesByChatId` (ordered history)                                     |
| `src/feature/messages/operations/messages.find.ts`   | ✅     | `getMessageById` (added for the async reply job + retry)                    |
| `src/feature/messages/operations/messages.update.ts` | ✅     | `updateMessageReplyStatus` (adds `replyStatus` to `chat_messages.metadata`) |

### 1.3 HTTP layer

| File                                                                                      | Status | Notes                                                                                                            |
| ----------------------------------------------------------------------------------------- | ------ | ---------------------------------------------------------------------------------------------------------------- |
| `src/feature/chats/chats.routes.ts`                                                       | ✅     | `POST/GET /v1/chats`, `GET/DELETE /v1/chats/:chatId`; mounted behind `authenticateToken` (`src/routes/index.ts`) |
| `src/feature/messages/messages.routes.ts`                                                 | ✅     | `POST /v1/messages`, `GET /v1/messages/:chatId/all`, `POST /v1/messages/:messageId/retry`                        |
| `src/feature/chats/controllers/create-chat.controller.ts`                                 | ✅     | Creates chat + first message, enqueues `MessageSent` job, responds 201 immediately                               |
| `src/feature/chats/controllers/get-chat.controller.ts`                                    | ✅     | Serializes chat with embedded messages                                                                           |
| `src/feature/chats/controllers/get-user-chats.controller.ts`, `delete-chat.controller.ts` | ✅     | List + delete                                                                                                    |
| `src/feature/messages/controllers/create-messages.controler.ts`                           | ✅     | Saves user msg, enqueues `MessageSent` job, responds 201 immediately                                             |
| `src/feature/messages/controllers/retry-message.controller.ts`                            | ✅     | `POST /v1/messages/:messageId/retry` — resets `replyStatus` and re-enqueues                                      |
| `src/feature/messages/controllers/get-messages.controller.ts`                             | 🟡     | Lists messages; ignores documented `limit`/`offset`                                                              |
| `src/errors.ts`                                                                           | 🟡     | `mapErrorToResponse` doesn't know `HttpError` → any `unwrap` failure surfaces as generic 500                     |
| `src/feature/chats/chats.docs.ts`                                                         | ✅     | Message schemas moved to the messages registry (fixes the `Message` type collision)                              |
| `src/feature/messages/messages.docs.ts`                                                   | ✅     | Documents `GET /v1/messages/{chatId}/all` + retry endpoint                                                       |

### 1.4 Background processing (jobs)

| File                                                        | Status | Notes                                                                                                                       |
| ----------------------------------------------------------- | ------ | --------------------------------------------------------------------------------------------------------------------------- |
| `src/lib/bullmq/`                                           | ✅     | `queueManager`, `createBullWorker`, retries/backoff, shutdown; Redis via `src/lib/redis` (default `redis://127.0.0.1:6379`) |
| `src/lib/bullmq/bullmq.init.ts`                             | ✅     | Documents + chat workers enabled                                                                                            |
| `src/feature/chats/jobs/chats.queue.ts` / `chats.worker.ts` | ✅     | Real queue + worker wiring (`QueueName.Chat`, handlers from `ChatsJobMap`)                                                  |
| `src/feature/chats/jobs/chats.jobs.ts`                      | ✅     | `handleMessageSent` runs RAG + LLM + persist and marks `replyStatus`; failure is recorded then rethrown for BullMQ retry    |
| `src/feature/messages/jobs/`                                | 🔴     | `MessageSent` stub; worker off, nothing enqueues it (orphaned)                                                              |

### 1.5 LLM / RAG (read path)

| File                                     | Status | Notes                                                                                                                                                       |
| ---------------------------------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/service/rag-service/rag.answer.ts`  | ✅     | `generateAssistantReply` — context → prompt → LLM → persist assistant msg with `metadata.sources`; called from the chat reply job                           |
| `src/service/rag-service/rag.context.ts` | ✅     | Chroma `legal_questions` (degrades to empty), history trimmed to last 10                                                                                    |
| `src/service/rag-service/rag.prompts.ts` | ✅     | `buildRagChatPrompt`                                                                                                                                        |
| `src/service/rag-service/rag.service.ts` | ✅     | `retrieveContext` (threshold 0.7)                                                                                                                           |
| `src/lib/llm/`                           | ✅     | `LLMProviderManager` default Ollama (`localhost:11434`, `gemma3:1b`); Gemini if `GEMINI_API_KEY` set; `getClient()` falls back to first registered provider |

### 1.6 Frontend touchpoints

| File                                                                          | Status | Notes                                                                                        |
| ----------------------------------------------------------------------------- | ------ | -------------------------------------------------------------------------------------------- |
| `frontend/app/feature/chats/screens/ChatScreen.tsx`                           | ✅     | Form validates only `content`; payload built from the loaded chat — follow-up send unblocked |
| `frontend/app/feature/chats/components/chat-form.tsx`                         | ✅     | New-chat form works (registers its field)                                                    |
| `frontend/app/feature/chats/hooks/use-chats.ts`                               | ✅     | `useMessages` polls while a reply is pending; `useRetryMessage` re-enqueues failed replies   |
| `frontend/app/lib/api/chat.api.ts`                                            | ✅     | Real `ChatMessage` shape (content/senderType/timestamp/chatId/metadata); `retryMessage`      |
| `frontend/app/feature/chats/components/MessageList.tsx` / `MessageBubble.tsx` | ✅     | Typing indicator while pending; error notice + Retry when a reply fails                      |
| `frontend/app/lib/api/generated/api.types.ts`                                 | 🟡     | `Message` shape still stale until `npm run generate:types:local` is re-run (C5.3)            |
| `frontend/app/routes/chats/$chatId.tsx`, `NewChatScreen.tsx`                  | ✅     | Create → `navigate('/chats/{id}')`; detail loads chat + messages                             |

---

## 2. Backlog (by phase, one layer per phase)

> Order reflects the implementation sequence. Each phase is independently shippable and verifiable.

### Phase 1 — Unblock follow-up sending (frontend)

- [x] **C1.1** `ChatScreen.tsx`: restrict the RHF form to `content` only (`z.string().min(1)`); drop `chatId`/`userId`/`senderType` from `defaultValues`; build the full `SendMessageRequest` in `onSubmit` from `chat.id`/`chat.userId` + `senderType: "user"`. Root cause: form defaults freeze while `chat` is pending, so the zod resolver rejects empty `chatId`/`userId` before `onSubmit` ever runs.

### Phase 2 — Async reply generation (backend, BullMQ)

- [x] **C2.1** `create-chat.controller.ts` + `create-messages.controler.ts`: stop awaiting `generateAssistantReply`. Insert the user message with `metadata: { ...metadata, replyStatus: "pending" }`, enqueue `ChatsJobs.MessageSent` `{ userId: user.id, messageId: userMessage.id }` on `QueueName.Chat` (best-effort try/catch), respond 201 immediately.
- [x] **C2.2** `chats.jobs.ts` `handleMessageSent`: `getMessageById` → `getMessagesByChatId` → `generateAssistantReply` → mark user message `replyStatus: "completed"`; on failure mark `replyStatus: "failed"` (with message) and rethrow for BullMQ retry (`attempts: 3`, exp backoff).
- [x] **C2.3** New `messages/operations/messages.find.ts` (`getMessageById`) + `messages.update.ts` (`updateMessageReplyStatus(messageId, status, error?)` via `db.update(chatMessages).set({ metadata })`).
- [x] **C2.4** Enable `initChatsWorker()` in `bullmq.init.ts`. Requires Redis (`infra/docker-compose.yml`).

### Phase 3 — Retry endpoint (backend)

- [x] **C3.1** `POST /v1/messages/:messageId/retry` → `retryMessageController`: verify message exists + `senderType === "user"`, reset `replyStatus: "pending"`, re-enqueue `MessageSent`.
- [x] **C3.2** Route in `messages.routes.ts` + OpenAPI registration in `messages.docs.ts`.

### Phase 4 — Poll & surface failures (frontend)

- [x] **C4.1** `useMessages`: conditional `refetchInterval` (~2s) while the last message is a user message with `metadata.replyStatus !== "failed"`; stop when an assistant reply lands or it failed.
- [x] **C4.2** `MessageList`/`ChatScreen`: typing indicator while last user message is `replyStatus: "pending"`; when `"failed"`, render an error notice with a **Retry** button. Safety net: treat pending older than ~60s as failed (covers enqueue failure when Redis is down).
- [x] **C4.3** `chat.api.ts` `retryMessage(messageId)` + `useRetryMessage` mutation.

### Phase 5 — Fix generated types (unblocks typecheck + new metadata access)

- [x] **C5.1** `chats.docs.ts`: remove the wrong `Message*` schema registrations and the `GET /v1/chats/{chatId}/messages` path — let `messages.docs.ts` own them.
- [x] **C5.2** `messages.docs.ts`: correct the documented path to `GET /v1/messages/{chatId}/all`.
- [ ] **C5.3** Regenerate `frontend/app/lib/api/generated/{api.types,api.schemas}.ts` via `npm run generate:types:local` (backend running).

### Phase 6 — Out of scope (flagged, not fixed)

- [ ] Rename: `updateChatTitle` calls `PATCH /v1/chats/:chatId` — no backend route exists (404).
- [ ] `HttpError` unmapped by `mapErrorToResponse` → generic 500s (correct 400/404 semantics lost).
- [ ] IDOR: no ownership checks on `getChatById` / `getMessagesByChatId` / `sendMessage`; `userId` taken from request body.
- [ ] `chat_sessions.updated_at` never bumped on message insert (chat-list recency stale).
- [ ] Streaming (SSE) responses — Phase 7 of `rag.md`.

---

## 3. Decisions & Constraints

- **Async reply generation**: create chat / save the user message immediately and return 201, then a BullMQ `MessageSent` job runs the RAG+LLM+persist work. Reuses the existing chat queue/worker (`QueueName.Chat`); the shared `generateAssistantReply` stays the single answer path.
- **Reply status lives on the user message** via `chat_messages.metadata.replyStatus` (`"pending" | "completed" | "failed"`) — no schema migration needed (jsonb exists).
- **Failure surfacing**: the frontend polls messages (2s) while a reply is pending; `"failed"` renders an error notice with Retry (re-enqueues the same user message — no duplicate user content). A 60s pending timeout is a safety net for the "Redis/queue down" case.
- **Enqueue is best-effort**: if Redis is unavailable the message is still saved and 201 returned (mirrors today's "message saved regardless of LLM failure" invariant).
- **`senderType` is ignored by the controllers** (derived from the authenticated role) and stays out of the form; the payload still includes it for schema compat.
- **Generated types**: the OpenAPI `Message` name collision was fixed before regenerating so `senderType`/`content`/`timestamp`/`chatId`/`metadata` type correctly; until C5.3 the frontend uses a local `ChatMessage` interface.
- **Verification**: `npm run typecheck` (root) + `npm run build` (root) + API test suite; manual flow with Redis (`infra/docker-compose.yml`), Ollama running (`gemma3:1b`) for success, Ollama stopped for the failed-reply + retry path.
