import { API_CONFIG } from "~/config";

export interface LegalAnswerResponse {
  question: string;
  country: string;
  answer: string;
  chatId: string;
  relatedDocuments: Array<{
    id: number;
    title: string;
    description: string;
    url: string;
  }>;
  relevantLaws: Array<{ title: string; description: string }>;
  provider: string;
  error?: string;
}

export async function submitLegalInquiry(question: string, country: string = "South Sudan"): Promise<LegalAnswerResponse> {
  const response = await fetch(
    `${API_CONFIG.BASE_URL}/questions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question,
        country,
      }),
    },
  );

  if (!response.ok) {
    throw new Error("Failed to get answer from the API");
  }

  return response.json();
}