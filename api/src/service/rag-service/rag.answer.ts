import { unwrap } from "@/lib/drizzle/drizzle.utils";
import { HttpError } from "@/lib/http/http.error";
import { HttpStatus } from "@/lib/http/http.status";
import { llmProviderManager } from "@/lib/llm";
import { sendMessage } from "@/feature/messages/operations/messages.create";
import type { ChatMessage } from "@/feature/messages/messages.types";
import { buildRagContext } from "./rag.context";
import { buildRagChatPrompt } from "./rag.prompts";
import {
  extractCitations,
  filterCitationsAgainstWhitelist,
} from "./rag.citations";

// Shared "answer the user's latest message" path used by both the messages
// controller (POST /v1/messages) and chat creation (POST /v1/chats), so the
// first message of a new chat gets answered too.
export const generateAssistantReply = async ({
  userMessage,
  history,
  userId,
}: {
  userMessage: ChatMessage;
  history: ChatMessage[];
  userId: string;
}) => {
  const { context, conversationHistory } = await buildRagContext(
    userMessage,
    history,
  );
  const prompt = buildRagChatPrompt(
    userMessage.content,
    conversationHistory,
    context,
  );

  const client = llmProviderManager.getClient();
  const result = await client.generateTextContent(prompt);

  // Post-generation citation validation — flag (never block) answers that
  // carry no citation (citations.md C4), and cross-check every citation the
  // model produced against the full citations that were actually retrieved.
  const { citations, hasCitation } = extractCitations(result.content);

  const citationWhitelist = context.chunks
    .map((chunk) => chunk.fullCitation)
    .filter((citation): citation is string => Boolean(citation));

  const { fabricated } = filterCitationsAgainstWhitelist(
    citations,
    citationWhitelist,
  );

  const metadata: Record<string, unknown> = {
    citationStatus: hasCitation ? "ok" : "missing",
    citations,
    citationWhitelist,
    fabricatedCitations: fabricated,
    hasFabricatedCitations: fabricated.length > 0,
  };
  if (context.sources.length) {
    metadata.sources = context.sources;
    // Convenience flag for the UI (citations.md C5.4 / metadata-updates.md U4.4)
    metadata.hasStaleSources = context.sources.some((source) => source.stale);
  }

  return unwrap(
    await sendMessage({
      chatId: userMessage.chatId,
      content: result.content,
      senderType: "assistant",
      userId,
      metadata,
    }),
    new HttpError(HttpStatus.BAD_REQUEST, "Failed to create AI message"),
  );
};
