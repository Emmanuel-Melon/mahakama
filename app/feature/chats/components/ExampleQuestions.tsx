import { useState } from "react";
import { Sparkles, ChevronDown, ChevronUp } from "lucide-react";

const EXAMPLE_QUESTIONS = [
  "What can I do if my landlord won't return my deposit?",
  "What are my rights if I'm injured at work?",
  "How do I file for divorce in this country?",
  "What should I do if I can't pay my rent this month?",
  "How do I report workplace discrimination?",
];

const LEGAL_CATEGORIES = [
  {
    id: "housing",
    name: "Housing & Land",
    icon: "🏠",
    questions: [
      "How can I resolve a dispute with my landlord?",
      "What are my rights as a tenant?",
      "How do I report illegal eviction?",
      "What should I know before signing a lease?",
    ],
  },
  {
    id: "employment",
    name: "Employment",
    icon: "💼",
    questions: [
      "What is the minimum wage in my area?",
      "Can my employer fire me without notice?",
      "What to do if I'm not being paid on time?",
      "How to report workplace harassment?",
    ],
  },
  {
    id: "family",
    name: "Family Law",
    icon: "👨‍👩‍👧‍👦",
    questions: [
      "How do I file for child support?",
      "What's the process for legal separation?",
      "How to get custody of my children?",
      "What are my rights in an inheritance dispute?",
    ],
  },
  {
    id: "consumer",
    name: "Consumer Rights",
    icon: "🛍️",
    questions: [
      "What can I do if I bought a faulty product?",
      "How to report a scam or fraud?",
      "What are my rights when returning items?",
      "How to deal with unauthorized charges?",
    ],
  },
] as const;

interface ExampleQuestionsProps {
  handleExampleClick: (question: string) => void;
}

interface LegalCategory {
  id: string;
  name: string;
  icon: string;
  questions: readonly string[];
}

interface CategoryProps {
  id: string;
  name: string;
  icon: string;
  questions: readonly string[];
  isOpen: boolean;
  onToggle: (id: string) => void;
  onSelectQuestion: (question: string) => void;
}

const Category = ({
  id,
  name,
  icon,
  questions,
  isOpen,
  onToggle,
  onSelectQuestion,
}: CategoryProps) => {
  return (
    <div className="border-b border-gray-200 last:border-0">
      <button
        onClick={() => onToggle(id)}
        className="w-full flex items-center justify-between py-3 px-4 text-left hover:bg-gray-50 transition-colors rounded-lg"
      >
        <div className="flex items-center gap-3">
          <span className="text-lg">{icon}</span>
          <span className="font-medium text-gray-900">{name}</span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>

      {isOpen && (
        <div className="pl-10 pr-4 pb-3 space-y-2">
          {questions.map((question, index) => (
            <button
              key={index}
              type="button"
              onClick={() => onSelectQuestion(question)}
              className="w-full text-left p-2 text-sm text-gray-700 hover:bg-yellow-50 rounded-md transition-colors flex items-start gap-2 group"
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-500 mt-0.5 flex-shrink-0" />
              <span className="text-left">{question}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export const ExampleQuestions = ({
  handleExampleClick,
}: ExampleQuestionsProps) => {
  return (
    <div className="space-y-2 w-full">
      <p className="text-sm text-gray-600 font-medium">Try asking:</p>
      <div className="flex flex-wrap gap-2 w-full overflow-x-auto pb-2 -mx-1 px-1">
        {EXAMPLE_QUESTIONS.map((question, index) => (
          <button
            key={index}
            type="button"
            onClick={() => handleExampleClick(question)}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 border border-gray-300 bg-white rounded-full hover:bg-yellow-50 transition-colors cursor-pointer flex-shrink-0 group"
            style={{
              boxShadow: "1px 1px 0 0 #000",
            }}
          >
            <Sparkles className="w-3 h-3 text-yellow-500 group-hover:scale-110 transition-transform" />
            <span>{question}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

interface ExampleCategoriesProps {
  onSelectQuestion: (question: string) => void;
}

export const ExampleCategories = ({
  onSelectQuestion,
}: ExampleCategoriesProps) => {
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  const toggleCategory = (id: string) => {
    setOpenCategory(openCategory === id ? null : id);
  };

  return (
    <div className="space-y-2 w-full">
      <p className="text-sm text-gray-600 font-medium mb-2">
        Or explore by category:
      </p>
      <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
        {LEGAL_CATEGORIES.map((category: LegalCategory) => (
          <Category
            key={category.id}
            {...category}
            isOpen={openCategory === category.id}
            onToggle={toggleCategory}
            onSelectQuestion={onSelectQuestion}
          />
        ))}
      </div>
    </div>
  );
};
