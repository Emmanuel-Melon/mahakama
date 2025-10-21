export interface Message {
  id: string;
  content: string;
  timestamp: string;
  sender: {
    type: string;
    displayName?: string;
  };
}

export interface Chat {
  id: string;
  title: string;
  updatedAt: string;
  messages: Message[];
}

export interface ChatListProps {
  chats: Chat[];
  error?: string;
  onRename: (chatId: string, newTitle: string) => void;
  onDelete: (chatId: string) => void;
  onRetry?: () => void;
  emptyStateTitle?: string;
  emptyStateMessage?: string;
  emptyStateButtonText?: string;
}