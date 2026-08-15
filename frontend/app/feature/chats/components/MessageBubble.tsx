import { Bot, RefreshCw } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ChatMessage } from "~/lib/api/chat.api";
import {
  hasFailedReply,
  isStalePendingReply,
  isUserMessage,
} from "../hooks/use-chats";

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

          {!isUser && (message.metadata.sources?.length || message.metadata.citationStatus === "missing") && (
            <div className="mt-3 border-t border-gray-200 pt-2 space-y-2">
              {message.metadata.sources?.length ? (
                message.metadata.sources.map((source, index) => (
                  <div
                    key={source.id ?? index}
                    className="text-xs text-gray-700"
                  >
                    <span className="font-semibold">Source:</span>{" "}
                    {source.url ? (
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {source.fullCitation ?? source.title}
                      </a>
                    ) : (
                      source.fullCitation ?? source.title
                    )}
                    {(source.jurisdiction || source.lastUpdated) && (
                      <span className="block text-gray-500 mt-0.5">
                        {[source.jurisdiction, source.lastUpdated && `as of ${source.lastUpdated}`]
                          .filter(Boolean)
                          .join(" \u00b7 ")}
                      </span>
                    )}
                    {source.content && (
                      <span className="block text-gray-500 mt-0.5">
                        Full text: &ldquo;{source.content}&rdquo;
                      </span>
                    )}
                  </div>
                ))
              ) : null}

              {message.metadata.citationStatus === "missing" && (
                <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1">
                  No specific legal source was found for this answer — treat it
                  as general information and verify with a lawyer.
                </p>
              )}

              {message.metadata.hasStaleSources && (
                <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1">
                  <p className="font-semibold">
                    Some cited information may be out of date.
                  </p>
                  {message.metadata.sources
                    ?.filter((source) => source.stale)
                    .map((source, index) => (
                      <p key={source.id ?? index} className="mt-0.5">
                        {source.fullCitation ?? source.title}
                        {source.lastUpdated &&
                          ` — based on text as of ${source.lastUpdated}`}
                        . A more recent amendment may exist.
                      </p>
                    ))}
                </div>
              )}
            </div>
          )}

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
