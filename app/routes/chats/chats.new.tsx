import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { BorderedBox } from "~/components/ui/bordered-box";
import { IconContainer } from "~/components/icon-container";
import { MessageCircle, ArrowRight, Sparkles } from "lucide-react";
import type { Route } from "./+types/chats.new";
import { Disclaimer } from "~/components/home/AnswerDisclaimer";
import { PageLayout } from "~/components/layouts/page-layout";
import { chatApi } from "~/lib/api/chat.api";
import { parseCookies } from "~/lib/api/utils";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Start New Chat - Mahakama" },
    {
      name: "description",
      content:
        "Ask a legal question and get guidance from Mahakama's AI legal assistant.",
    },
  ];
}

const suggestedQuestions = [
  "What are my rights as a tenant in a rental dispute?",
  "How do I file for divorce and what documents do I need?",
  "What are the penalties for traffic violations?",
  "How can I protect my business intellectual property?",
];

async function handleCreateChat(question: string) {
  try {
    const token = parseCookies(document.cookie).token;
    if (!token) {
      throw new Error("Authentication required");
    }

    const { chat } = await chatApi.createChat(question, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return chat;
  } catch (error) {
    console.error("Error creating chat:", error);
    throw error;
  }
}

export default function NewChat() {
  const navigate = useNavigate();
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSuggestedQuestion = async (q: string) => {
    setQuestion(q);
    setIsLoading(true);
    setError(null);

    try {
      const chat = await handleCreateChat(q);
      navigate(`/chat/${chat.id}`);
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to create chat. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="w-full max-w-6xl mx-auto px-4 py-8 md:py-16">
        <div className="w-full">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-400 rounded-full blur-lg opacity-30 animate-pulse"></div>
                <IconContainer
                  icon={MessageCircle}
                  size="lg"
                  color="handdrawn"
                  className="relative"
                />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-2 font-serif">
              Start a New Chat
            </h1>
            <p className="text-gray-600 text-lg">
              Ask your legal question and get guidance from Mahakama's AI
              assistant
            </p>
          </div>

          {/* Main Form */}
          <BorderedBox
            variant="decorated"
            label="New Consultation"
            labelClassName="bg-blue-100 text-blue-800 font-bold"
            className="space-y-6 mb-8"
          >
            <form
              className="space-y-4"
              onSubmit={async (e) => {
                e.preventDefault();
                if (!question.trim()) return;

                setIsLoading(true);
                setError(null);

                try {
                  const chat = await handleCreateChat(question);
                  navigate(`/chat/${chat.id}`);
                } catch (err) {
                  console.error("Error:", err);
                  setError("Failed to create chat. Please try again.");
                } finally {
                  setIsLoading(false);
                }
              }}
            >
              <div>
                <label
                  htmlFor="question"
                  className="block text-sm font-bold text-gray-700 mb-3"
                >
                  What's your legal question?
                </label>
                <Textarea
                  id="question"
                  value={question}
                  name="question"
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Describe your legal situation in detail..."
                  className="w-full border-2 border-gray-900 font-medium min-h-[150px] resize-none"
                  style={{
                    boxShadow: "2px 2px 0 0 #000",
                    borderRadius: "4px 8px 4px 8px",
                  }}
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={!question.trim() || isLoading}
                className="w-full border-2 border-gray-900 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-black text-base py-3 transition-all hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2"
                style={{
                  boxShadow: "3px 3px 0 0 #000",
                  borderRadius: "4px 12px 4px 12px",
                }}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating chat...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Get Legal Guidance
                  </>
                )}
              </Button>
              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}
            </form>
          </BorderedBox>

          {/* Suggested Questions */}
          <div>
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">
              Or try one of these:
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {suggestedQuestions.map((q, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestedQuestion(q)}
                  className="text-left p-4 border-2 border-gray-900 bg-white hover:bg-gray-50 transition-all hover:shadow-md text-gray-700 hover:text-gray-900 font-medium text-sm"
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

          {/* Footer Info */}
          <div className="mt-12 text-center text-sm text-gray-600">
            <Disclaimer text="Your questions are processed confidentially. This is not a substitute for professional legal advice." />
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
