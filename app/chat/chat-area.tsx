import { cn } from "~/lib/utils";
import { MessageBubble } from "~/components/ui/message-bubble";

interface ChatAreaProps {
  messages: Array<{
    id: string;
    content: string;
    sender?: { type: "assistant" | "user" };
  }>;
  relevantLaws?: Array<{ title: string; description: string }>;
  relatedDocuments?: Array<{
    id: number;
    title: string;
    description: string;
    url: string;
  }>;
  isLoading?: boolean;
  className?: string;
}

export function ChatArea({
  messages = [],
  relevantLaws = [],
  relatedDocuments = [],
  isLoading = false,
  className = "",
}: ChatAreaProps) {
  return (
    <div className={cn("h-[75vh] overflow-y-auto px-2", className)}>
      <div className="space-y-4 w-full">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "group relative w-full max-w-full px-2",
              message.sender?.type === "assistant" ? "pr-6" : "pl-6",
              "mb-4 last:mb-0",
            )}
          >
            <MessageBubble
              isUser={message.sender?.type !== "assistant"}
              className="w-auto max-w-full"
            >
              <div className="space-y-2 break-words">
                <p className="font-medium leading-relaxed break-words">
                  {message.content}
                </p>

                {message.sender?.type === "assistant" &&
                  relevantLaws?.length > 0 && (
                    <div className="mt-2">
                      <div className="text-xs font-semibold text-gray-500 mb-1">
                        Relevant Laws:
                      </div>
                      <div className="space-y-2">
                        {relevantLaws.map((law, index) => (
                          <div
                            key={index}
                            className="text-sm p-2 bg-gray-50 rounded"
                          >
                            <div className="font-medium">{law.title}</div>
                            <div className="text-gray-600">
                              {law.description}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {message.sender?.type === "assistant" &&
                  relatedDocuments?.length > 0 && (
                    <div className="mt-2">
                      <div className="text-xs font-semibold text-gray-500 mb-1">
                        Related Documents:
                      </div>
                      <div className="space-y-2">
                        {relatedDocuments.map((doc) => (
                          <a
                            key={doc.id}
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-sm p-2 bg-blue-50 rounded hover:bg-blue-100 text-blue-700"
                          >
                            <div className="font-medium">{doc.title}</div>
                            <div className="text-blue-600">
                              {doc.description}
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            </MessageBubble>
          </div>
        ))}

        {isLoading && (
          <div className="max-w-[80%] mr-auto">
            <MessageBubble isUser={false}>
              <div className="flex items-center space-x-2">
                <div
                  className="w-2 h-2 rounded-full bg-gray-300 animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <div
                  className="w-2 h-2 rounded-full bg-gray-300 animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <div
                  className="w-2 h-2 rounded-full bg-gray-300 animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            </MessageBubble>
          </div>
        )}
      </div>
    </div>
  );
}
