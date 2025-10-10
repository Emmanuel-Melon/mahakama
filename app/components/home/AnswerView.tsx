"use client"
import { FileText, Scale, Share2, Bookmark, MessageCircle } from "lucide-react"
import { AnswerDisclaimer } from "./AnswerDisclaimer"
import { RelevantLaws } from "./RelevantLaws";

interface LegalAnswerDisplayProps {
  question: string
  country?: string
  answer: string
  onNewQuestion: () => void
}

export function LegalAnswerDisplay({ question, country = "South Sudan", answer, onNewQuestion }: LegalAnswerDisplayProps) {
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

        <div className="space-y-6">
          <div>
            <div className="relative inline-block mb-3">
              <h3 className="text-2xl font-black text-gray-900 font-serif">Legal Answer</h3>
              <div className="absolute -bottom-1 left-0 right-0 h-2 bg-yellow-200/60 -rotate-1 transform -z-10"></div>
            </div>

            <div className="prose prose-sm max-w-none">
              <div 
                className="prose max-w-none" 
                dangerouslySetInnerHTML={{ 
                  __html: answer.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
                }} 
              />
            </div>
          </div>
          <RelevantLaws />


          {/* Related Documents */}
          <div>
            <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Related Legal Documents
            </h4>
            <div className="grid gap-3">
              <a
                href="/legal-database/1"
                className="block p-3 border-2 border-gray-900 bg-white hover:bg-yellow-50 transition-colors"
                style={{
                  borderRadius: "6px 12px 6px 12px",
                  boxShadow: "2px 2px 0 0 #000",
                }}
              >
                <p className="font-bold text-sm text-gray-900">Tenant Rights and Responsibilities Guide</p>
                <p className="text-xs text-gray-600 mt-1">Complete overview of tenant-landlord relationships</p>
              </a>
              <a
                href="/legal-database/2"
                className="block p-3 border-2 border-gray-900 bg-white hover:bg-yellow-50 transition-colors"
                style={{
                  borderRadius: "6px 12px 6px 12px",
                  boxShadow: "2px 2px 0 0 #000",
                }}
              >
                <p className="font-bold text-sm text-gray-900">Security Deposit Disputes: A Legal Guide</p>
                <p className="text-xs text-gray-600 mt-1">Step-by-step process for recovering deposits</p>
              </a>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-4 border-t-2 border-gray-200">
            <button
              onClick={onNewQuestion}
              className="px-4 py-2 bg-yellow-400 hover:bg-yellow-300 border-2 border-gray-900 font-bold text-sm transition-all transform hover:-translate-y-0.5"
              style={{
                borderRadius: "6px 12px 6px 12px",
                boxShadow: "2px 2px 0 0 #000",
              }}
            >
              Ask Follow-up Question
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-white hover:bg-gray-50 border-2 border-gray-900 font-bold text-sm transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
              style={{
                borderRadius: "6px 12px 6px 12px",
                boxShadow: "2px 2px 0 0 #000",
              }}
            >
              <Bookmark className="h-4 w-4" />
              Save Answer
            </button>
            <button
              onClick={handleShare}
              className="px-4 py-2 bg-white hover:bg-gray-50 border-2 border-gray-900 font-bold text-sm transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
              style={{
                borderRadius: "6px 12px 6px 12px",
                boxShadow: "2px 2px 0 0 #000",
              }}
            >
              <Share2 className="h-4 w-4" />
              Share
            </button>
          </div>

          {/* Disclaimer */}
          <AnswerDisclaimer />
        </div>
      </div>
    </div>
  )
}
