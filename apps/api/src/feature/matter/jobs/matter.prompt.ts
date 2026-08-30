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
    .map(
      (turn) =>
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
        .map(
          (turn) =>
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

/*
 * MATTER DOCUMENT ANALYSIS
 * Prompt builder + structured-output schema for analyzing a matter's legal
 * document (process-matter-document-analysis job handler).
 */

export const DOCUMENT_ANALYSIS_PROMPT_CONFIG = {
  // Cap the number of document characters fed to the model to stay within
  // the model context window.
  MAX_DOCUMENT_CHARS: 60000,
} as const;

export const matterDocumentAnalysisSchema = z.object({
  summary: z.string(),
  documentType: z.string().optional(),
  parties: z
    .array(
      z.object({
        name: z.string(),
        role: z.string().optional(),
      }),
    )
    .default([]),
  claims: z.array(z.string()).default([]),
  requestedRelief: z.string().optional(),
  keyDates: z
    .array(
      z.object({
        date: z.string(),
        description: z.string(),
      }),
    )
    .default([]),
  risks: z.array(z.string()).default([]),
  applicableLaws: z.array(z.string()).default([]),
  recommendations: z.array(z.string()).default([]),
});

export type MatterDocumentAnalysis = z.infer<
  typeof matterDocumentAnalysisSchema
>;

export const buildMatterDocumentAnalysisPrompt = (
  fileName: string,
  documentText: string,
): string => {
  const trimmedText = documentText.slice(
    0,
    DOCUMENT_ANALYSIS_PROMPT_CONFIG.MAX_DOCUMENT_CHARS,
  );

  return `You are a legal document analyst for Mahakama, assisting attorneys who serve clients in Uganda and South Sudan.

Read the legal document below and produce a structured analysis an attorney can use to understand it quickly.

Use ONLY what the document actually contains. Do not invent facts, parties, names, dates, laws, or remedies.

### Document
- File name: ${fileName}

### Document text
${trimmedText}

### Output rules
1. summary: 2-4 sentences summarizing what the document is about and its key content.
2. documentType: the kind of document when identifiable (e.g. "Lease Agreement", "Employment Contract", "Complaint", "Will").
3. parties: named individuals or entities appearing in the document with their role when identifiable.
4. claims: the claims, obligations, or demands stated in the document.
5. requestedRelief: what a party ultimately seeks (e.g. "Recover unpaid rent", "Compensation for injury"). Empty string when unclear.
6. keyDates: important dates (effective dates, deadlines, expiry, hearing dates) referenced in the document.
7. risks: potential risks or red flags an attorney should flag (e.g. unfavorable clauses, missing signatures, ambiguity).
8. applicableLaws: specific laws or regulations referenced in the document when identifiable.
9. recommendations: practical next steps an attorney could advise based on the document.

Respond with JSON only, conforming to the schema.`;
};
