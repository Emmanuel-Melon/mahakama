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
          const citation =
            chunk.fullCitation ??
            (chunk.section
              ? `[${chunk.title}, ${chunk.section}]`
              : `[${chunk.title}]`);
          return `${citation}\n${chunk.content}`;
        })
        .join("\n\n---\n\n")}`
    : "RELEVANT LEGAL CONTEXT: None found for this question. Answer from general knowledge, but state clearly that you could not find a specific legal provision to cite.";

  const historyText = history.length
    ? history
        .map(
          (turn) =>
            `${turn.role === "user" ? "User" : "Assistant"}: ${turn.content}`,
        )
        .join("\n")
    : "(no prior conversation)";

  // Staleness note (metadata-updates.md U4.3): when any retrieved chunk may be
  // out of date, list it and tell the LLM to flag it in its answer rather than
  // quietly relying on stale law text.
  const staleChunks = context.chunks.filter((chunk) => chunk.stale);
  const stalenessNote = staleChunks.length
    ? `POTENTIALLY OUTDATED PASSAGES:
${staleChunks
  .map((chunk) => {
    const citation = chunk.fullCitation ?? chunk.title;
    return `- ${citation}${chunk.lastUpdated ? ` (as of ${chunk.lastUpdated})` : ""}`;
  })
  .join("\n")}

When your answer relies on one of the passages above, add a brief note like "This information is based on [the act's name] as of [date]. A more recent amendment may exist." Never invent an amendment date you do not have.
`
    : "";

  return `You are Mahakama, an AI legal assistant helping people in Uganda and South Sudan understand their legal rights.

${contextSection}

CONVERSATION HISTORY:
${historyText}

${stalenessNote}INSTRUCTIONS:
1. Answer in clear, plain language that anyone can understand.
2. Cite specific laws and sections when the legal context supports it (e.g., "Under Landlord and Tenant Act 2022, Section 3..."). When a full citation is shown above a passage (e.g., "Landlord and Tenant Act 2022, Section 3"), reproduce that citation string verbatim in your answer.
3. Use the provided legal context as the primary basis for your answer; do not invent laws or sections that are not in it.
4. If the legal context does not cover the question (or none was found), say so clearly rather than fabricating a citation.
5. Maintain conversation continuity using the history above.
6. Provide actionable next steps when appropriate.
7. Never give definitive legal advice — remind users to consult a qualified lawyer for their specific situation.

USER QUESTION:
${question}

ANSWER:`;
};
