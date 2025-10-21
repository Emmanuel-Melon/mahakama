import { useState } from "react";
import { AnswerDisclaimer } from "./AnswerDisclaimer";
import { BorderedBox } from "~/components/ui/bordered-box";
import { ChatInput } from "../../chat/chat-input";
import { ChatArea } from "../../chat/chat-area";

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
  answer: any;
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
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleShare = () => {
    alert("Share functionality coming soon!");
  };

  const handleSave = () => {
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

    setInputValue("");
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "I'm a placeholder response. In a real implementation, this would come from your AI service.",
        isUser: false,
        timestamp: new Date(),
        metadata: {},
      };
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full">
      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        

          <BorderedBox
            label="Legal Consultation"
            labelClassName="bg-yellow-100 text-yellow-800 font-bold"
            variant="decorated"
            className="relative bg-white border-2 border-gray-900 p-6 flex flex-col"
            style={{
              borderRadius: "8px 16px 8px 16px",
              boxShadow: "3px 3px 0 0 #000",
            }}
          >
            <span className="absolute -right-2 -top-2 w-4 h-4 border-t-2 border-r-2 border-gray-900"></span>
            <span className="absolute -left-2 -bottom-2 w-4 h-4 border-b-2 border-l-2 border-gray-900"></span>
            <ChatArea 
              messages={answer || []} 
              relevantLaws={relevantLaws}
              relatedDocuments={relatedDocuments}
              isLoading={isLoading}
            />
          </BorderedBox>
        </div>
      </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-6 w-full">
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