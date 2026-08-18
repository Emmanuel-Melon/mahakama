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
    : `RELEVANT LEGAL CONTEXT: None found for this question.

No legal provision is available to cite for this question. Do not answer it — not from general knowledge, not from training data, not from anything outside the context above. Do not name any act, section, or date. Respond only with a brief statement that you could not find applicable legal information for this question in the available sources, and advise the user to consult a qualified lawyer or the relevant local authority. Do not attempt to partially answer.`;

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
1. Answer only from the RELEVANT LEGAL CONTEXT below. Ground every factual claim in it. Never use outside or general knowledge of specific laws, even if the context below says none was found — that message is your final answer, not something to supplement.
2. Answer in clear, plain language that anyone can understand.
3. Cite specific laws and sections when the legal context supports it (e.g., "Under Landlord and Tenant Act 2022, Section 3..."). When a full citation is shown above a passage (e.g., "Landlord and Tenant Act 2022, Section 3"), reproduce that citation string verbatim in your answer.
4. Do not invent laws, section numbers, or dates that are not in the context. Never introduce a section number that does not appear in a citation line above the passages.
5. If no context was found for this question, say so clearly and stop — do not fabricate a citation and do not attempt a general-knowledge answer.
6. Do not reuse section numbers, laws, or claims from previous assistant answers in the conversation history. They may be outdated or incorrect — the legal context above is the only authoritative source for this answer.
7. Maintain conversation continuity using the history above.
8. Provide relevant context about legal procedures where the text mentions them,
   but do not instruct the user to take specific action. Instead, explain what
   the law says about their rights and direct them to a qualified lawyer.
   
   Example of GOOD response:
   "The Land Act states that a landlord must give 30 days' notice. The law also
   mentions that a tenant may apply to court for relief. A lawyer can advise you
   on whether court action is appropriate in your situation."
   
   Example of BAD response:
   "You should file a case in court within 30 days."

${contextSection}

CONVERSATION HISTORY:
${historyText}

${stalenessNote}USER QUESTION:
${question}

ANSWER:`;
};
