import type { components } from "~/lib/api/generated/api.types";
import { Bot } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export type ChatMessage = components["schemas"]["Message"];

interface ExtendedChatMessage extends Omit<ChatMessage, 'senderType'> {
  user?: {
    id: string;
    name: string | null;
    email: string;
    role: "user" | "assistant" | "system";
  };
}

interface MessageBubbleProps {
  message: ChatMessage;
  isSending?: boolean;
}

export function MessageBubble({ message, isSending = false }: MessageBubbleProps) {
  const extendedMessage = message as ExtendedChatMessage;
  const isUser = extendedMessage.user?.role === 'user' || message.senderType === 'user';

  if (isSending) {
    return (
      <div className="flex justify-start">
        <div 
          className="bg-gray-100 text-gray-900 rounded-lg p-4" 
          style={{ 
            borderRadius: '4px 8px 4px 8px', 
            maxWidth: "calc(100% - 2rem)" 
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Bot className="w-4 h-4 mt-1 flex-shrink-0" />
            <span className="text-xs font-medium opacity-75">Legal Assistant</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`rounded-lg p-4 ${
          isUser
            ? 'bg-white border-2 border-gray-900 text-gray-900'
            : 'text-gray-900'
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
                h1: ({node, ...props}) => <h1 className="text-lg font-bold mt-4 mb-2 first:mt-0" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-base font-bold mt-3 mb-2 first:mt-0" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-sm font-semibold mt-3 mb-1 first:mt-0" {...props} />,
                p: ({node, ...props}) => <p className="mb-3 last:mb-0" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-3 space-y-1" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-3 space-y-1" {...props} />,
                li: ({node, ...props}) => <li className="leading-relaxed" {...props} />,
                strong: ({node, ...props}) => <strong className="font-semibold" {...props} />,
                em: ({node, ...props}) => <em className="italic" {...props} />,
                a: ({node, ...props}) => <a className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
                blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-gray-300 pl-4 italic my-2" {...props} />,
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}
        
        <div className="text-xs opacity-60 mt-2">
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </div>
    </div>
  );
}