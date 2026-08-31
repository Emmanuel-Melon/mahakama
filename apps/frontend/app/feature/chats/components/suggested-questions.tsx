import { ArrowRight } from "lucide-react";

const suggestedQuestions = [
  "What is the exact penalty under Section 9 of the Landlord and Tenant Act for a landlord who unlawfully evicts a tenant without a court order?",
  "According to the Landlord and Tenant Act, what is the maximum notice period a landlord must give to terminate a monthly tenancy?",
  "Under what specific circumstances does the Landlord and Tenant Act permit a tenant to withhold rent for unpaid utility bills?",
  "What are the precise statutory requirements for a landlord seeking to increase rent under a fixed-term tenancy agreement?",
  "According to the Landlord and Tenant Act, what steps must a landlord take to dispose of property left behind by a tenant after eviction?",
  "What specific remedies does the Landlord and Tenant Act provide to a tenant subjected to unlawful distress for rent?",
];

interface SuggestedQuestionsProps {
  onQuestionClick: (question: string) => void;
  disabled?: boolean;
}

export const SuggestedQuestions = ({
  onQuestionClick,
  disabled = false,
}: SuggestedQuestionsProps) => {
  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">
        Or try one of these:
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {suggestedQuestions.map((q, index) => (
          <button
            key={index}
            onClick={() => onQuestionClick(q)}
            disabled={disabled}
            className="text-left p-4 border-2 border-gray-900 bg-white hover:bg-gray-50 transition-all hover:shadow-md text-gray-700 hover:text-gray-900 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              boxShadow: "2px 2px 0 0 #000",
              borderRadius: "4px 8px 4px 8px",
            }}
          >
            <div className="flex items-start justify-between gap-2">
              <span>{q}</span>
              <ArrowRight className="w-4 h-4 flex-shrink-0 mt-0.5" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
