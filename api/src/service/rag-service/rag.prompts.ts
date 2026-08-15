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

INSTRUCTIONS:
1. Answer only from the RELEVANT LEGAL CONTEXT below. Ground every factual claim in it. Do not use outside knowledge of specific laws.
2. Answer in clear, plain language that anyone can understand.
3. Cite specific laws and sections when the legal context supports it (e.g., "Under Landlord and Tenant Act 2022, Section 3..."). When a full citation is shown above a passage (e.g., "Landlord and Tenant Act 2022, Section 3"), reproduce that citation string verbatim in your answer.
4. Do not invent laws, section numbers, or dates that are not in the context. Never introduce a section number that does not appear in a citation line above the passages.
5. If the legal context does not cover the question (or none was found), say so clearly rather than fabricating a citation.
6. Do not reuse section numbers, laws, or claims from previous assistant answers in the conversation history. They may be outdated or incorrect — the legal context above is the only authoritative source for this answer.
7. Maintain conversation continuity using the history above.
8. Provide actionable next steps when appropriate.
9. Never give definitive legal advice — remind users to consult a qualified lawyer for their specific situation.

${contextSection}

CONVERSATION HISTORY:
${historyText}

${stalenessNote}USER QUESTION:
${question}

ANSWER:`;
};
