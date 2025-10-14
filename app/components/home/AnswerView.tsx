"use client";
import { useState } from "react";
import { AnswerDisclaimer } from "./AnswerDisclaimer";
import { RelevantLaws } from "./RelevantLaws";
import { ResponseControls } from "./ResponseControls";
import { RelatedDocuments } from "./RelatedDocuments";
import { AnswerContent } from "./AnswerContent";
import { BorderedBox } from "~/components/ui/bordered-box";
import { MessageBubble } from "~/components/ui/message-bubble";
import {
  MessageCircle,
  Bot,
  Copy,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  Share2,
} from "lucide-react";
import { cn } from "~/lib/utils";
import { ChatInput } from "../chat/chat-input";
import { Button } from "~/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";

export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  metadata?: {
    relevantLaws?: any[];
    relatedDocuments?: any[];
  };
}

export interface LawItem {
  title: string;
  description: string;
}

export interface DocumentItem {
  id: number;
  title: string;
  description: string;
  url: string;
}

interface LegalAnswerDisplayProps {
  question: string;
  country?: string;
  answer: string;
  relevantLaws: LawItem[];
  relatedDocuments: DocumentItem[];
  onNewQuestion: () => void;
}

export function LegalAnswerDisplay({
  question,
  country = "South Sudan",
  answer,
  relevantLaws = [],
  relatedDocuments = [],
  onNewQuestion,
}: LegalAnswerDisplayProps) {
  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: "1",
      content: question,
      isUser: true,
      timestamp: new Date(),
    },
    {
      id: "2",
      content: answer,
      isUser: false,
      timestamp: new Date(),
      metadata: { relevantLaws, relatedDocuments },
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleShare = () => {
    // Stub: Share functionality
    alert("Share functionality coming soon!");
  };

  const handleSave = () => {
    // Stub: Save functionality
    alert("Answer saved to your profile!");
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "I'm a placeholder response. In a real implementation, this would come from your AI service.",
        isUser: false,
        timestamp: new Date(),
        metadata: {},
      };

      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error("Error sending message:", error);
      // Handle error state
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] min-h-[500px]">
      <div className="space-y-6 flex-1 overflow-hidden flex flex-col">
        <AnswerDisclaimer />

        <BorderedBox
          label="Legal Consultation"
          labelClassName="bg-yellow-100 text-yellow-800 font-bold"
          variant="decorated"
          className="relative bg-white border-2 border-gray-900 p-6 flex-1 flex flex-col min-h-[400px]"
          style={{
            borderRadius: "8px 16px 8px 16px",
            boxShadow: "3px 3px 0 0 #000",
          }}
        >
          <span className="absolute -right-2 -top-2 w-4 h-4 border-t-2 border-r-2 border-gray-900"></span>
          <span className="absolute -left-2 -bottom-2 w-4 h-4 border-b-2 border-l-2 border-gray-900"></span>

          <div className="flex-1 overflow-y-auto space-y-4 pr-2 -mr-2">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "group relative max-w-[90%] md:max-w-[80%]",
                    message.isUser ? "ml-auto" : "mr-auto",
                    "mb-4 last:mb-0",
                  )}
                >
                  <MessageBubble isUser={message.isUser} className="w-full">
                    <div className="space-y-2">
                      <p className="font-medium leading-relaxed">
                        {message.content}
                      </p>

                      {!message.isUser && relevantLaws?.length > 0 && (
                        <RelevantLaws laws={relevantLaws} />
                      )}

                      {!message.isUser && relatedDocuments?.length > 0 && (
                        <RelatedDocuments documents={relatedDocuments} />
                      )}
                    </div>
                  </MessageBubble>
                </div>
              ))}

              {isLoading && (
                <MessageBubble isUser={false} className="max-w-[80%] mr-auto">
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
              )}
            </div>
          </div>
        </BorderedBox>
      </div>

      <div className="mt-4">
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
  );
}
