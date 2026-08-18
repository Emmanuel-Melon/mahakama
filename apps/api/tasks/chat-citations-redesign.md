# Chat Citations Redesign — Implementation Plan

## Overview

Redesign the chat screen to:

1. Remove full citation cards from inline message bubbles
2. Add numbered inline refs (`[1]`, `[2]`) on the **latest assistant message** linking to the right sidebar
3. Extract the right sidebar into a dedicated component (`CitationsSidebar`)
4. Make the sidebar persistently visible (internal scroll only)
5. Display the legal disclaimer **once** below the chat header (not per message)

---

## Phase 1: Extract Right Sidebar into `CitationsSidebar` Component

### New File

`frontend/app/feature/chats/components/CitationsSidebar.tsx`

### Props

```ts
interface CitationsSidebarProps {
  sources: RAGSource[]; // from chat.api.ts
  focusedCitation?: number | null; // 0-based index of highlighted card
}
```

### Rendering (moved from `ChatScreen.tsx:190-243`)

- `<aside className="w-80 flex-shrink-0 hidden lg:flex flex-col h-full bg-background border-l overflow-y-auto">`
- **Header** (sticky top): FileText icon + "Source Citations" + count badge
- **Body**: scrollable list of cards, one per source
  - Each card gets `id="citation-<n>"` (1-based) for scroll targeting
  - Card: numbered badge (index+1), title, content excerpt or `fullCitation`, "View Source Link →" if `url`
  - Highlight when `focusedCitation === index` (e.g., `ring-2 ring-blue-400 bg-blue-50`)
- **Empty state**: "No citations available for the current context yet."

### Notes

- Import `RAGSource` from `~/lib/api/chat.api`
- No state management inside — highlight driven by parent via `focusedCitation`

---

## Phase 2: Update `ChatScreen.tsx` Layout & State

### Layout Fix (internal scroll)

Change root wrapper:

```tsx
// Before
<div className="flex h-full w-full overflow-hidden bg-background">

// After — flex-1 min-h-0 lets parent (SidebarInset flex column) give a definite height,
// so only the message pane scrolls internally; sidebar stays visible.
<div className="flex flex-1 min-h-0 w-full overflow-hidden bg-background">
```

No `position: fixed`/sticky or header-height math needed — the parent chain already provides a viewport-relative flex container.

### Insert Disclaimer

Place `<AnswerDisclaimer />` in the main chat column, **between `ActiveChatHeader` and the scrolling message area**:

```tsx
<div className="flex-shrink-0 sticky top-0 z-10">
  <ActiveChatHeader ... />
</div>
<AnswerDisclaimer />           {/* NEW — single persistent disclaimer */}
<div className="flex-1 min-h-0">
  <div className="w-full p-4 pb-8 h-full overflow-y-auto">
    <MessageList ... />
  </div>
</div>
```

### Replace Inline Sidebar

Remove the inline `<aside>` (lines 190-243) and replace with:

```tsx
<CitationsSidebar sources={activeSources} focusedCitation={focusedCitation} />
```

### New State & Handler

```tsx
const [focusedCitation, setFocusedCitation] = useState<number | null>(null);

const handleCitationClick = (index: number) => {
  const el = document.getElementById(`citation-${index + 1}`);
  el?.scrollIntoView({ behavior: "smooth", block: "center" });
  setFocusedCitation(index);
  // Clear highlight after ~1.5s
  setTimeout(() => setFocusedCitation(null), 1500);
};
```

### Thread to MessageList

Pass down:

- `citationMessageId` — the `id` of the latest assistant message (already computed as `lastAssistantMessage?.id`)
- `onCitationClick={handleCitationClick}`

### Cleanup

- Remove unused `FileText` import (now used in `CitationsSidebar`)
- Keep `activeSources` logic unchanged (latest assistant message's `metadata.sources`)

---

## Phase 3: Thread Props Through `MessageList` → `MessageBubble`

### `MessageList.tsx`

```tsx
interface MessageListProps {
  messages: ChatMessage[];
  isLoading?: boolean;
  showTyping?: boolean;
  onRetry?: (messageId: string) => void;
  isRetrying?: boolean;
  citationMessageId?: string; // NEW
  onCitationClick?: (index: number) => void; // NEW
}
```

In the map:

```tsx
<MessageBubble
  key={message.id}
  message={message}
  onRetry={onRetry}
  isRetrying={isRetrying}
  showCitationRefs={message.id === citationMessageId} // NEW
  onCitationClick={onCitationClick} // NEW
/>
```

### `MessageBubble.tsx`

Add props:

```tsx
interface MessageBubbleProps {
  message: ChatMessage;
  onRetry?: (messageId: string) => void;
  isRetrying?: boolean;
  showCitationRefs?: boolean; // NEW
  onCitationClick?: (index: number) => void; // NEW
}
```

For assistant messages, **after the markdown content**, render ref chips only when `showCitationRefs && metadata.sources?.length`:

```tsx
{
  showCitationRefs && metadata.sources?.length > 0 && (
    <div
      className="flex items-center gap-1.5 mt-2 flex-wrap"
      aria-label="Citation references"
    >
      {metadata.sources.map((_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onCitationClick?.(i)}
          className="inline-flex items-center justify-center text-[10px] font-medium text-blue-600 hover:text-blue-800 hover:underline px-1.5 py-0.5 rounded bg-blue-50 border border-blue-100"
          aria-label={`View source ${i + 1}`}
        >
          [{i + 1}]
        </button>
      ))}
    </div>
  );
}
```

Replace the existing `<MessageMetadata metadata={message.metadata} />` with this + keep `<MessageMetadata ... />` for warnings only (see Phase 4).

---

## Phase 4: Simplify `MessageMetadata.tsx` to Warnings Only

### Current behavior (lines 18-47)

Renders full "Source:" blocks for each source — **remove this section entirely**.

### Keep (lines 49-67)

- `citationStatus === "missing"` → amber "No specific legal source was found..." banner
- `hasStaleSources` → amber "Some cited information may be out of date." + per-stale-source lines

These are per-message legal-safety warnings, not citation cards, and should remain on every assistant message.

### Result

`MessageMetadata` becomes a warnings-only component. No change to its prop signature.

---

## Phase 5: Minor Cleanup

### `TypingIndicator.tsx` (line 10)

Remove unused import:

```ts
// import { MessageMetadata } from "./MessageMetadata";  // DELETE
```

### `frontend/app/feature/chats/components/index.ts`

No changes needed — `CitationsSidebar` imported directly where used (consistent with other components).

---

## Verification Checklist

After implementation, manually verify:

| Scenario                         | Expected                                                                             |
| -------------------------------- | ------------------------------------------------------------------------------------ |
| Load chat with existing messages | Sidebar shows sources from latest assistant message; disclaimer visible below header |
| Scroll message list extensively  | Sidebar stays in place (no page scroll); only message pane scrolls                   |
| Click `[1]` on latest reply      | Sidebar scrolls to card #1, highlights briefly (~1.5s)                               |
| Older assistant messages         | Show missing/stale warnings; **no** `[1] [2]` ref chips                              |
| New assistant reply arrives      | Sidebar updates to new message's sources; ref chips appear on new message            |
| Mobile (< lg)                    | Sidebar hidden (existing `hidden lg:flex`); ref chips still render but clicks no-op  |
| `npm run typecheck`              | Passes (frontend)                                                                    |
| `npm run build`                  | Passes (root)                                                                        |

---

## Files to Create / Modify

| File                                                         | Action                                                             |
| ------------------------------------------------------------ | ------------------------------------------------------------------ |
| `frontend/app/feature/chats/components/CitationsSidebar.tsx` | **Create**                                                         |
| `frontend/app/feature/chats/screens/ChatScreen.tsx`          | **Modify** (layout, disclaimer, sidebar replacement, state, props) |
| `frontend/app/feature/chats/components/MessageList.tsx`      | **Modify** (thread `citationMessageId`, `onCitationClick`)         |
| `frontend/app/feature/chats/components/MessageBubble.tsx`    | **Modify** (add props, render ref chips, keep warnings)            |
| `frontend/app/feature/chats/components/MessageMetadata.tsx`  | **Modify** (remove source blocks, keep warnings)                   |
| `frontend/app/feature/chats/components/TypingIndicator.tsx`  | **Modify** (remove unused import)                                  |

---

## Dependencies & Constraints

- **No backend/API changes** — purely frontend UI restructuring
- **No routing changes** — same `/chats/:chatId` screen
- **Existing uncommitted `ChatScreen.tsx` changes** (from working tree) are the baseline — build on top
- **CSS/Styling**: Uses existing Tailwind classes + shadcn `CardWithLabel`, `Button` (if needed); no new CSS files
- **TypeScript**: All props typed via existing `RAGSource`, `ChatMessage` from `~/lib/api/chat.api`

---

## Open Questions (Resolved)

1. **Inline ref style** → Numbered chips `[1] [2]` (approved)
2. **Sidebar source scope** → Latest assistant message only (approved)
3. **Disclaimer placement** → Top of chat, below header (approved)
4. **Mobile behavior** → Sidebar hidden (existing); refs render but non-functional (acceptable)

---

## Next Steps

1. Review this plan
2. Approve to begin **Phase 1** (create `CitationsSidebar.tsx`)
3. Subsequent phases approved one at a time after verifying output
