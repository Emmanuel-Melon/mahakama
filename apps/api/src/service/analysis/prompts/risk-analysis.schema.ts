import {
  riskAnalysisSchema,
  type RiskDocumentAnalysis,
  type AnalysisPrompt,
} from "../analysis.types";
import { DOCUMENT_ANALYSIS_CONFIG } from "../analysis.config";

export const riskAnalysisPrompt: AnalysisPrompt = {
  schema: riskAnalysisSchema,

  buildPrompt(fileName: string, documentText: string): string {
    const trimmedText = documentText.slice(
      0,
      DOCUMENT_ANALYSIS_CONFIG.MAX_DOCUMENT_CHARS,
    );

    return `You are a legal risk analyst for Mahakama, assisting attorneys who serve clients in Uganda and South Sudan.

Read the legal document below and produce a risk-focused assessment an attorney can use to advise a client.

Use ONLY what the document actually contains. Do not invent facts, parties, names, dates, laws, or remedies.

### Document
- File name: ${fileName}

### Document text
${trimmedText}

### Output rules
1. summary: 1-2 sentences summarizing the document's purpose and relevant context.
2. riskLevel: an overall assessment of "low", "medium", or "high" risk to the client based on the document's content.
3. risks: specific risks, unfavorable clauses, missing signatures, ambiguities, or red flags an attorney should flag, each as a concise item.
4. mitigations: practical actions the client/attorney could take to reduce or address each identified risk.

Respond with JSON only, conforming to the schema.`;
  },
};

export type { RiskDocumentAnalysis };
