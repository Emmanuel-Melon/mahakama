import { MessageCircle } from "lucide-react";
import { MessageBubble, TypingIndicator } from "./MessageBubble";
import type { ChatMessage } from "~/lib/api/chat.api";

interface MessageListProps {
  messages: ChatMessage[];
  isLoading?: boolean;
  showTyping?: boolean;
  onRetry?: (messageId: string) => void;
  isRetrying?: boolean;
}

export function MessageList({
  messages,
  isLoading,
  showTyping = false,
  onRetry,
  isRetrying = false,
}: MessageListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!messages || messages.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <p>No messages yet. Start the conversation!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 px-4">
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          onRetry={onRetry}
          isRetrying={isRetrying}
        />
      ))}
      {showTyping && <TypingIndicator />}
    </div>
  );
}
