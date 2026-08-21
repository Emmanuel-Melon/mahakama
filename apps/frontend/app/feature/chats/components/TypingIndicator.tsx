import { Bot, RefreshCw } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ChatMessage } from "@mah/api/src/clients/chat.api";
import {
  hasFailedReply,
  isStalePendingReply,
  isUserMessage,
} from "@mah/api/src/hooks/chats/use-chats";

interface MessageBubbleProps {
  message: ChatMessage;
  onRetry?: (messageId: string) => void;
  isRetrying?: boolean;
}

export function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div
        className="bg-gray-100 text-gray-900 rounded-lg p-4"
        style={{
          borderRadius: "4px 8px 4px 8px",
          maxWidth: "calc(100% - 2rem)",
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Bot className="w-4 h-4 mt-1 flex-shrink-0" />
          <span className="text-xs font-medium opacity-75">
            Legal Assistant
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <div
            className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
            style={{ animationDelay: "0ms" }}
          ></div>
          <div
            className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
            style={{ animationDelay: "150ms" }}
          ></div>
          <div
            className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
            style={{ animationDelay: "300ms" }}
          ></div>
        </div>
      </div>
    </div>
  );
}
