import { useState } from "react";
import { useNavigate } from "react-router";
import { submitLegalInquiry, type LegalAnswerResponse } from "./api";

export function useLegalInquiry() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (question: string, country: string = "South Sudan") => {
    if (!question.trim()) {
      setError("Question is required");
      return { error: "Question is required" };
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const data = await submitLegalInquiry(question, country);
      
      // Redirect to the chat view with the chat ID
      if (data?.chatId) {
        navigate(`/chat/${data.chatId}`);
      }
      
      return { data };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred while processing your question";
      setError(errorMessage);
      console.error("Error in handleSubmit:", err);
      return { error: errorMessage };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    error,
    handleSubmit,
  };
}

export type { LegalAnswerResponse } from "./api";