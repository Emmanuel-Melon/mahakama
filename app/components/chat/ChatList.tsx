import { ChatItem } from "./ChatItem";
import { EmptyState } from "./EmptyState";
import { ErrorState } from "./ErrorState";
import type { ChatListProps } from "~/types/chat";


export function ChatList({
  chats,
  error,
  onRename,
  onDelete,
  onRetry,
  emptyStateTitle = "No recent chats",
  emptyStateMessage = "Your chat history will appear here",
  emptyStateButtonText = "Start a New Chat"
}: ChatListProps) {
  if (error) {
    return <ErrorState error={error} onRetry={onRetry} />;
  }

  if (chats.length === 0) {
    return (
      <EmptyState 
        title={emptyStateTitle}
        message={emptyStateMessage}
        buttonText={emptyStateButtonText}
      />
    );
  }

  return (
    <div className="h-[calc(100vh-300px)] overflow-y-auto pr-2">
      <div className="space-y-4">
        {chats.map((chat) => (
          <ChatItem
            key={chat.id}
            id={chat.id}
            title={chat.title}
            updatedAt={chat.updatedAt}
            messageCount={chat.messages.length}
            onRename={(newTitle) => onRename(chat.id, newTitle)}
            onDelete={() => onDelete(chat.id)}
          />
        ))}
      </div>
    </div>
  );
}
