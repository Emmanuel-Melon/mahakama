import { ChatItem } from "./ChatItem";
import type { AsyncState } from "@mah/api/src/api/api.types";

import type { Chat } from "@mah/api/src/clients/chat.api";
import EmptyState from "~/components/async-state/EmptyState";
import { ErrorState } from "~/components/async-state/ErrorState";

export interface ChatListProps extends AsyncState {
  chats: Chat[];
  onRename: (chatId: string, newTitle: string) => void;
  onDelete: (chatId: string) => void;
  onRetry?: () => void;
}

export function ChatList({
  chats,
  error,
  onRename,
  onDelete,
  onRetry,
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
          },
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
