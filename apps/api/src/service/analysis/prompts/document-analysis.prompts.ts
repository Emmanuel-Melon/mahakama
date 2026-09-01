import {
  fullAnalysisSchema,
  type FullDocumentAnalysis,
  type AnalysisPrompt,
} from "../analysis.types";
import { DOCUMENT_ANALYSIS_CONFIG } from "../analysis.config";

export const fullAnalysisPrompt: AnalysisPrompt = {
  schema: fullAnalysisSchema,

  buildPrompt(fileName: string, documentText: string): string {
    const trimmedText = documentText.slice(
      0,
      DOCUMENT_ANALYSIS_CONFIG.MAX_DOCUMENT_CHARS,
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
  },
};

export type { FullDocumentAnalysis };
