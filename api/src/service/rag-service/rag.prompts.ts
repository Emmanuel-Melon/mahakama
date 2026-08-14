import type { RAGContext, ConversationTurn } from "./rag.types";

export const buildRagChatPrompt = (
  question: string,
  history: ConversationTurn[],
  context: RAGContext,
): string => {
  const hasContext = context.chunks.length > 0;

  const contextSection = hasContext
    ? `RELEVANT LEGAL CONTEXT:\n${context.chunks
        .map((chunk) => {
          const citation = chunk.section
            ? `[${chunk.title}, ${chunk.section}]`
            : `[${chunk.title}]`;
          return `${citation}\n${chunk.content}`;
        })
        .join("\n\n---\n\n")}`
    : "RELEVANT LEGAL CONTEXT: None found for this question. Answer from general knowledge, but state clearly that you could not find a specific legal provision to cite.";

  const historyText = history.length
    ? history
        .map((turn) => `${turn.role === "user" ? "User" : "Assistant"}: ${turn.content}`)
        .join("\n")
    : "(no prior conversation)";

  return `You are Mahakama, an AI legal assistant helping people in Uganda and South Sudan understand their legal rights.

${contextSection}

CONVERSATION HISTORY:
${historyText}

INSTRUCTIONS:
1. Answer in clear, plain language that anyone can understand.
2. Cite specific laws and sections when the legal context supports it (e.g., "Under Section 26 of the Constitution of Uganda...").
3. Use the provided legal context as the primary basis for your answer; do not invent laws or sections that are not in it.
4. If the legal context does not cover the question (or none was found), say so clearly rather than fabricating a citation.
5. Maintain conversation continuity using the history above.
6. Provide actionable next steps when appropriate.
7. Never give definitive legal advice — remind users to consult a qualified lawyer for their specific situation.

USER QUESTION:
${question}

ANSWER:`;
};
