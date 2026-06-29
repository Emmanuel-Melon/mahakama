import { useState } from "react";
import { ChatInput } from "~/feature/chats/components/chat-input";
import { ChatArea } from "~/feature/chats/components/chat-area";
import { type ChatType } from "~/lib/api/chat.api";

interface ChatViewProps {
  chatData: ChatType;
  onSendMessage: (content: string) => Promise<void>;
  relevantLaws?: Array<{ title: string; description: string }>;
  relatedDocuments?: Array<{
    id: number;
    title: string;
    description: string;
    url: string;
  }>;
}

export function ChatView({
  chatData,
  onSendMessage,
  relevantLaws = [],
  relatedDocuments = [],
}: ChatViewProps) {
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const messageContent = inputValue;
    setInputValue("");
    setIsLoading(true);

    try {
      await onSendMessage(messageContent);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-xl font-bold text-gray-900 truncate">
            {chatData.title}
          </h1>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="max-w-6xl mx-auto h-full">
          <ChatArea
            messages={[]}
            relevantLaws={relevantLaws}
            relatedDocuments={relatedDocuments}
            isLoading={isLoading}
            className="flex-1 overflow-y-auto"
          />
        </div>
      </div>

      <div className="sticky bottom-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 w-full">
          <ChatInput
            value={inputValue}
            onChange={setInputValue}
            onSubmit={handleSendMessage}
            isLoading={isLoading}
            placeholder="Type your follow-up question..."
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
