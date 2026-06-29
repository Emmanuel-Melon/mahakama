import { ragService } from "./rag.service";

export const buildRagContext = async (userMessage: any, history: any[]) => {
  // 1. Use RAG to retrieve relevant legal context
  const ragContext = await ragService.retrieveContext(userMessage.content, {
    collectionName: "messages",
    topK: 5,
    minSimilarity: 0.7,
  });

  // 4. Build conversation history for LLM
  const conversationHistory = history
    .filter((m) => m.id !== userMessage.messageId) // Exclude current message
    .map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));

  // 5. Build system prompt with RAG context
  return [];
};
