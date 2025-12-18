import type { components } from "~/lib/api/generated/api.types";
import { MessageCircle, Bot, User } from "lucide-react";

export type ChatMessage = components["schemas"]["Message"];

// Extended type to handle the new API response structure
interface ExtendedChatMessage extends Omit<ChatMessage, 'senderType'> {
  user?: {
    id: string;
    name: string | null;
    email: string;
    role: "user" | "assistant" | "system";
  };
}

interface MessageListProps {
  messages: ChatMessage[];
  isLoading?: boolean;
}

export function MessageList({ messages, isLoading }: MessageListProps) {
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
    <div className="space-y-4">
      {messages.map((message) => {
        const extendedMessage = message as ExtendedChatMessage;
        const isUser = extendedMessage.user?.role === 'user' || message.senderType === 'user';
        
        return (
          <div
            key={message.id}
            className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-lg p-4 ${
                isUser
                  ? 'bg-white border-2 border-gray-900 text-gray-900'
                  : 'bg-gray-100 text-gray-900 border border-gray-200'
              }`}
              style={{
                boxShadow: isUser ? "2px 2px 0 0 #000" : "none",
                borderRadius: isUser ? "4px 8px 4px 8px" : "4px 8px 4px 8px",
              }}
            >
              <div className="flex items-start gap-2 mb-2">
                {isUser ? (
                  <User className="w-4 h-4 mt-1 flex-shrink-0" />
                ) : (
                  <Bot className="w-4 h-4 mt-1 flex-shrink-0" />
                )}
                <span className="text-xs font-medium opacity-75">
                  {isUser ? 'You' : 'Legal Assistant'}
                </span>
              </div>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {message.content}
              </p>
              <div className="text-xs opacity-60 mt-2">
                {new Date(message.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
