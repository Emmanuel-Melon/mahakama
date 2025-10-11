"use client"
import { AnswerDisclaimer } from "./AnswerDisclaimer"
import { RelevantLaws } from "./RelevantLaws"
import { ResponseControls } from "./ResponseControls"
import { RelatedDocuments } from "./RelatedDocuments"
import { AnswerContent } from "./AnswerContent"

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
  onNewQuestion 
}: LegalAnswerDisplayProps) {
  const handleShare = () => {
    // Stub: Share functionality
    alert("Share functionality coming soon!")
  }

  const handleSave = () => {
    // Stub: Save functionality
    alert("Answer saved to your profile!")
  }

  return (
    <div className="space-y-6">
      {/* Answer Display */}
      <div
        className="relative bg-white border-2 border-gray-900 p-6"
        style={{
          borderRadius: "8px 16px 8px 16px",
          boxShadow: "3px 3px 0 0 #000",
        }}
      >
        <span className="absolute -right-2 -top-2 w-4 h-4 border-t-2 border-r-2 border-gray-900"></span>
        <span className="absolute -left-2 -bottom-2 w-4 h-4 border-b-2 border-l-2 border-gray-900"></span>

        <div className="space-y-4">
          <AnswerContent answer={answer} />
          {relevantLaws.length > 0 && <RelevantLaws laws={relevantLaws} />}
          <RelatedDocuments documents={relatedDocuments} />
          <ResponseControls 
            onNewQuestion={onNewQuestion}
            onSave={handleSave}
            onShare={handleShare}
          />
          <AnswerDisclaimer />
        </div>
      </div>
    </div>
  )
}
