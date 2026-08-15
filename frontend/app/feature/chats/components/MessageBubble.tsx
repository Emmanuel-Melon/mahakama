import { Bot, RefreshCw } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ChatMessage } from "~/lib/api/chat.api";
import {
  hasFailedReply,
  isStalePendingReply,
  isUserMessage,
} from "../hooks/use-chats";
import { MessageMetadata } from "./MessageMetadata";

interface MessageBubbleProps {
  message: ChatMessage;
  onRetry?: (messageId: string) => void;
  isRetrying?: boolean;
}

export function MessageBubble({
  message,
  onRetry,
  isRetrying = false,
}: MessageBubbleProps) {
  const isUser = isUserMessage(message);
  const isFailed = hasFailedReply(message) || isStalePendingReply(message);

  return (
    <div>
      <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
        <div
          className={`rounded-lg p-4 ${
            isUser
              ? "bg-white border-2 border-gray-900 text-gray-900"
              : "text-gray-900"
          }`}
          style={{
            boxShadow: isUser ? "2px 2px 0 0 #000" : "none",
            borderRadius: isUser ? "4px 8px 4px 8px" : "none",
            maxWidth: "calc(100% - 2rem)",
          }}
        >
          {isUser ? (
            <p className="text-sm leading-relaxed break-words">
              {message.content}
            </p>
          ) : (
            <div className="text-sm leading-relaxed break-words">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ node, ...props }) => (
                    <h1
                      className="text-lg font-bold mt-4 mb-2 first:mt-0"
                      {...props}
                    />
                  ),
                  h2: ({ node, ...props }) => (
                    <h2
                      className="text-base font-bold mt-3 mb-2 first:mt-0"
                      {...props}
                    />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3
                      className="text-sm font-semibold mt-3 mb-1 first:mt-0"
                      {...props}
                    />
                  ),
                  p: ({ node, ...props }) => (
                    <p className="mb-3 last:mb-0" {...props} />
                  ),
                  ul: ({ node, ...props }) => (
                    <ul
                      className="list-disc pl-5 mb-3 space-y-1"
                      {...props}
                    />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol
                      className="list-decimal pl-5 mb-3 space-y-1"
                      {...props}
                    />
                  ),
                  li: ({ node, ...props }) => (
                    <li className="leading-relaxed" {...props} />
                  ),
                  strong: ({ node, ...props }) => (
                    <strong className="font-semibold" {...props} />
                  ),
                  em: ({ node, ...props }) => (
                    <em className="italic" {...props} />
                  ),
                  a: ({ node, ...props }) => (
                    <a
                      className="text-blue-600 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                      {...props}
                    />
                  ),
                  blockquote: ({ node, ...props }) => (
                    <blockquote
                      className="border-l-4 border-gray-300 pl-4 italic my-2"
                      {...props}
                    />
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}

          {/* Delegated to the isolated MessageMetadata component */}
          {!isUser && <MessageMetadata metadata={message.metadata} />}

          <div className="text-xs opacity-60 mt-2">
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      </div>

      {isUser && isFailed && (
        <div className="flex justify-end mt-2">
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-md px-3 py-2 text-xs max-w-[calc(100%-2rem)]">
            <p className="flex-1">
              The assistant reply could not be generated.
            </p>
            <button
              type="button"
              onClick={() => onRetry?.(message.id)}
              disabled={isRetrying}
              className="inline-flex items-center gap-1 font-medium hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw
                className={`w-3 h-3 ${isRetrying ? "animate-spin" : ""}`}
              />
              {isRetrying ? "Retrying..." : "Retry"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}