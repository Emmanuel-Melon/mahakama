import {
  summaryAnalysisSchema,
  type SummaryDocumentAnalysis,
  type AnalysisPrompt,
} from "../analysis.types";
import { DOCUMENT_ANALYSIS_CONFIG } from "../analysis.config";

export const summaryAnalysisPrompt: AnalysisPrompt = {
  schema: summaryAnalysisSchema,

  buildPrompt(fileName: string, documentText: string): string {
    const trimmedText = documentText.slice(
      0,
      DOCUMENT_ANALYSIS_CONFIG.MAX_DOCUMENT_CHARS,
    );

    return `You are a legal document summarizer for Mahakama, assisting attorneys who serve clients in Uganda and South Sudan.

Read the legal document below and produce a concise summary an attorney can skim to understand it quickly.

Use ONLY what the document actually contains. Do not invent facts, parties, names, dates, laws, or remedies.

### Document
- File name: ${fileName}

### Document text
${trimmedText}

### Output rules
1. summary: 2-4 sentences summarizing what the document is about and its key content.
2. documentType: the kind of document when identifiable (e.g. "Lease Agreement", "Employment Contract", "Complaint", "Will").
3. keyPoints: a list of the most important points, provisions, or facts an attorney should know.

Respond with JSON only, conforming to the schema.`;
  },
};

export type { SummaryDocumentAnalysis };
