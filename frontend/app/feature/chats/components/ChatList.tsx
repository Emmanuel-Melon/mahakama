import { ChatItem } from "./ChatItem";
import { EmptyState } from "~/components/async-state/empty";
import { ErrorState } from "~/components/async-state/error";
import type { components } from "~/lib/api/generated/api.types";

export type Chat = components["schemas"]["Chat"];
export interface ChatListProps {
  chats: Chat[];
  error?: string;
  onRename: (chatId: string, newTitle: string) => void;
  onDelete: (chatId: string) => void;
  onRetry?: () => void;
}


export function ChatList({
  chats,
  error,
  onRename,
  onDelete,
  onRetry
}: ChatListProps) {
  if (error) {
    return <ErrorState error={error} onRetry={onRetry} />;
  }

  if (chats.length === 0) {
    return (
      <EmptyState
        title="No recent chats"
        description="Your chat history will appear here"
        actions={[
          {
            label: "Start a New Chat",
            href: "/chats/new",
            variant: "default",
          }
        ]}
      />
    );
  }

  return (
    <div>
      <div className="space-y-3 sm:space-y-4">
        {chats.map((chat) => (
          <ChatItem
            key={chat.id}
            chat={chat}
            onRename={(newTitle) => onRename(chat?.id!, newTitle)}
            onDelete={() => onDelete(chat?.id!)}
          />
        ))}
      </div>
    </div>
  );
}
