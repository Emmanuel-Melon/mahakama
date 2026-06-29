import type { components } from "~/lib/api/generated/api.types";
import { MessageCircle } from "lucide-react";
import { MessageBubble } from "./MessageBubble";

export type ChatMessage = components["schemas"]["Chat"];

interface MessageListProps {
  messages: ChatMessage[];
  isLoading?: boolean;
  isSending?: boolean;
}

export function MessageList({ messages, isLoading, isSending = false }: MessageListProps) {
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
        <MessageBubble key={message.id} message={message} />
      ))}
      {isSending && (
        <MessageBubble 
          message={{} as ChatMessage} 
          isSending={true} 
        />
      )}
    </div>
  );
}
