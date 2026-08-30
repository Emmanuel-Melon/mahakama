import { z } from "zod";
import type { Matter } from "../matter.types";

/*
 * MATTER PROMPTS
 * Prompt builders + structured-output schemas for the LLM-powered matter
 * job handlers (matter-from-chat, generate-matter-summary).
 */

export const MATTER_PROMPT_CONFIG = {
  // Cap how much of the source conversation we feed the model.
  MAX_TRANSCRIPT_TURNS: 20,
} as const;

export interface MatterConversationTurn {
  role: "user" | "assistant";
  content: string;
}

const urgencySchema = z.enum(["low", "medium", "high"]);

/*
 * Determinies what gets generated from a chat conversation when converting it
 * into a matter draft. Mirror image of the `matters` table columns so the
 * handler can insert the extraction almost verbatim.
 */
export const matterExtractionSchema = z.object({
  shouldCreateMatter: z.boolean(),
  title: z.string(),
  summary: z.string(),
  jurisdiction: z.string().optional(),
  practiceArea: z.string().optional(),
  urgency: urgencySchema.optional(),
  keyParties: z.array(z.string()),
  requestedRelief: z.string().optional(),
});

export type MatterExtraction = z.infer<typeof matterExtractionSchema>;

export const matterSummarySchema = z.object({
  summary: z.string(),
  updatedTitle: z.string().optional(),
});

export type MatterSummary = z.infer<typeof matterSummarySchema>;

export const buildMatterFromChatPrompt = (
  transcript: MatterConversationTurn[],
): string => {
  const transcriptText = transcript
    .map((turn) =>
      `${turn.role === "user" ? "Client" : "Assistant"}: ${turn.content}`,
    )
    .join("\n");

  return `You are a legal matter intake assistant for Mahakama, serving clients in Uganda and South Sudan.

Your task is to read the conversation below between a client and an AI legal assistant and decide whether it describes a legal matter that warrants creating a formal case file.

Extract ONLY what the conversation supports. Do not invent facts, names, dates, laws, or remedies.

### Extraction rules
1. shouldCreateMatter: true only when the client describes a concrete legal problem or dispute (e.g. landlord dispute, employment claim, family matter, debt, injury, contract disagreement) that would benefit from a case file. Set false for general questions, small talk, greetings, or purely informational queries with no real dispute.
2. title: a short, client-facing title (e.g. "Landlord refusing to return deposit"), 3-8 words.
3. summary: 2-4 sentences covering the client's situation, the parties involved, and what they want.
4. jurisdiction: the country/jurisdiction if stated or clearly implied; default to "Uganda" when unknown.
5. practiceArea: a legal domain label when identifiable (e.g. "Land Law", "Family Law", "Employment Law").
6. urgency: one of "low", "medium", "high" based on immediacy signals (eviction, deadlines, imminent harm → high).
7. keyParties: named individuals or entities the client mentions (omit the client's own name unless they give it). Empty array when names are unknown.
8. requestedRelief: what the client ultimately wants (e.g. "Recover deposit", "Compensation for injury"). Empty string if unclear.

CONVERSATION:
${transcriptText}

Respond with JSON only, conforming to the schema.`;
};

export const buildMatterSummaryPrompt = (
  matter: Matter,
  transcript: MatterConversationTurn[] = [],
  notes: string[] = [],
): string => {
  const transcriptText = transcript.length
    ? transcript
        .map((turn) =>
          `${turn.role === "user" ? "Client" : "Assistant"}: ${turn.content}`,
        )
        .join("\n")
    : "(no linked conversation)";

  const notesText = notes.length ? notes.join("\n") : "(none)";

  return `You are a legal matter summarizer for Mahakama. Generate a concise matter summary an attorney can skim to understand the dispute quickly.

Use ONLY the information provided below. Do not invent facts, parties, or legal claims.

### Existing matter record
- Title: ${matter.title}
- Status: ${matter.status}
- Jurisdiction: ${matter.jurisdiction ?? "unknown"}
- Practice area: ${matter.practiceArea ?? "unknown"}

### Source conversation
${transcriptText}

### Matter notes
${notesText}

### Output rules
1. summary: 2-4 sentences covering the dispute, the parties, the current posture, and what the client wants.
2. updatedTitle: provide only when a clearer title emerges from the context; otherwise omit.

Respond with JSON only, conforming to the schema.`;
};