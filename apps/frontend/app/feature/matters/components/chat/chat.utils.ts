import type { ChatMessage } from "@mah/api/src/clients/chat.api";

export const SUBSTANTIVE_MIN_LENGTH = 300;

export const isSubstantiveAssistantMessage = (message: ChatMessage) => {
  if (message.senderType !== "assistant") return false;
  const sources = message.metadata?.sources;
  return (
    (Array.isArray(sources) && sources.length > 0) ||
    message.content.length >= SUBSTANTIVE_MIN_LENGTH
  );
};
