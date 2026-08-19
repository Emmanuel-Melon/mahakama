import { RAG_CONTEXT_CONFIG } from "./rag.config";
import { ragService } from "./rag.service";
import type {
  RAGContext,
  ConversationTurn,
  RagContextResult,
} from "./rag.types";
import type { ChatMessage } from "@/feature/messages/messages.types";
import { logger } from "@/lib/logger";
import {
  retrieveDocumentContext,
  mergeDocumentContexts,
  sessionHasDocument,
} from "@/feature/documents/operations/documents.rag";
import { DocumentConfig } from "@/feature/documents/documents.config";

export const buildRagContext = async (
  userMessage: ChatMessage,
  history: ChatMessage[],
): Promise<RagContextResult> => {
  const sessionId = userMessage.chatId;

  // Retrieve legal context — degrade to empty context rather than failing the
  // whole message flow when Chroma is unavailable.
  let legalContext: RAGContext = { chunks: [], sources: [] };
  try {
    // Use increased top_k when user document is present
    const hasUserDoc = await sessionHasDocument(sessionId);
    const topK = hasUserDoc
      ? DocumentConfig.QUERY_TOP_K_WITH_USER_DOC
      : RAG_CONTEXT_CONFIG.TOP_K;

    legalContext = await ragService.retrieveContext(userMessage.content, {
      collectionName: RAG_CONTEXT_CONFIG.COLLECTION_NAME,
      topK,
      minSimilarity: RAG_CONTEXT_CONFIG.RELEVANCE_THRESHOLD,
    });
  } catch (error) {
    logger.error(
      { error },
      "Failed to retrieve RAG context; continuing without it",
    );
  }

  // Retrieve user document context if present
  let userDocContext: RAGContext = { chunks: [], sources: [] };
  try {
    userDocContext = await retrieveDocumentContext(
      sessionId,
      userMessage.content,
    );
  } catch (error) {
    logger.error(
      { error, sessionId },
      "Failed to retrieve user document context; continuing without it",
    );
  }

  // Merge contexts if user document exists
  const context =
    userDocContext.chunks.length > 0
      ? mergeDocumentContexts(userDocContext, legalContext)
      : legalContext;

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
