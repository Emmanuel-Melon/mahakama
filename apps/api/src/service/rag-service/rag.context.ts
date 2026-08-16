import { ragService } from "./rag.service";
import type { RAGContext, ConversationTurn } from "./rag.types";
import type { ChatMessage } from "@/feature/messages/messages.types";
import { logger } from "@/lib/logger";

const COLLECTION_NAME = "legal_questions";
const TOP_K = 5;
const MIN_SIMILARITY = 0.7;
const HISTORY_LIMIT = 10;

export interface RagContextResult {
  context: RAGContext;
  conversationHistory: ConversationTurn[];
}

export const buildRagContext = async (
  userMessage: ChatMessage,
  history: ChatMessage[],
): Promise<RagContextResult> => {
  // Retrieve legal context — degrade to empty context rather than failing the
  // whole message flow when Chroma is unavailable.
  let context: RAGContext = { chunks: [], sources: [] };
  try {
    context = await ragService.retrieveContext(userMessage.content, {
      collectionName: COLLECTION_NAME,
      topK: TOP_K,
      minSimilarity: MIN_SIMILARITY,
    });
  } catch (error) {
    logger.error(
      { error },
      "Failed to retrieve RAG context; continuing without it",
    );
  }

  const conversationHistory = history
    .filter((m) => m.id !== userMessage.id)
    .slice(-HISTORY_LIMIT)
    .filter((m) => m.senderType === "user" || m.senderType === "assistant")
    .map((m) => ({
      role: m.senderType as "user" | "assistant",
      content: m.content,
    }));

  return { context, conversationHistory };
};
