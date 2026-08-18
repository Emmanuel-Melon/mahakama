import { RAG_CONTEXT_CONFIG } from "./rag.config";
import { ragService } from "./rag.service";
import type {
  RAGContext,
  ConversationTurn,
  RagContextResult,
} from "./rag.types";
import type { ChatMessage } from "@/feature/messages/messages.types";
import { logger } from "@/lib/logger";

export const buildRagContext = async (
  userMessage: ChatMessage,
  history: ChatMessage[],
): Promise<RagContextResult> => {
  // Retrieve legal context — degrade to empty context rather than failing the
  // whole message flow when Chroma is unavailable.
  let context: RAGContext = { chunks: [], sources: [] };
  try {
    context = await ragService.retrieveContext(userMessage.content, {
      collectionName: RAG_CONTEXT_CONFIG.COLLECTION_NAME,
      topK: RAG_CONTEXT_CONFIG.TOP_K,
      minSimilarity: RAG_CONTEXT_CONFIG.MIN_SIMILARITY,
    });
  } catch (error) {
    logger.error(
      { error },
      "Failed to retrieve RAG context; continuing without it",
    );
  }

  const conversationHistory = history
    .filter((m) => m.id !== userMessage.id)
    .slice(-RAG_CONTEXT_CONFIG.HISTORY_LIMIT)
    .filter((m) => m.senderType === "user" || m.senderType === "assistant")
    .map((m) => ({
      role: m.senderType as "user" | "assistant",
      content: m.content,
    }));

  return { context, conversationHistory };
};
