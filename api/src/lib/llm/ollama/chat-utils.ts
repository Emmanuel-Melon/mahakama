import { LLMMessage, MessageRole } from "../llms.types";
import { SenderType } from "@/feature/chats/chats.types";

/**
 * Converts a chat message from your schema to Ollama's message format
 */
export function toOllamaMessage(
  content: string,
  senderType: SenderType,
): LLMMessage {
  return {
    role: (senderType === SenderType.USER
      ? "user"
      : "assistant") as MessageRole,
    content,
  };
}

/**
 * Converts Ollama's response to your chat message format
 */
export function fromOllamaMessage(
  message: LLMMessage,
  senderId: string,
  chatId: string,
) {
  return {
    chatId,
    content: message.content,
    senderId,
    senderType:
      message.role === "user" ? SenderType.USER : SenderType.ASSISTANT,
    metadata: {},
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

/**
 * Prepares the system prompt for the chat
 */
export function createSystemPrompt(
  initialMessage: string,
  mostRelevantLaw: any,
): LLMMessage {
  return {
    role: "system",
    content: `You are a legal assistant. Use the following legal context to answer the user's question.
    
Legal Context:
${JSON.stringify(mostRelevantLaw, null, 2)}

User's question: ${initialMessage}`,
  };
}

export function createChatSessionPayload(
  title: string,
  initialMessage: string,
  relevantLaws: any[],
  userId: string,
) {
  return {
    userId,
    title,
    message: initialMessage,
    metadata: {
      relevantLaws: relevantLaws.map((law) => ({
        id: law.id,
        title: law.title,
        similarityScore: law.similarityCosineScore,
      })),
    },
    senderType: "user" as const,
  };
}
