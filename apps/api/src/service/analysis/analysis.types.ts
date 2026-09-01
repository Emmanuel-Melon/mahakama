import { z } from "zod";
import { ANALYSIS_TYPES, type AnalysisType } from "./analysis.config";

/*
 * ANALYSIS OUTPUT SCHEMAS
 * One Zod schema (and matching inferred type) per analysis type. Each drives
 * the LLM's structured output so results come back validated & type-safe.
 */

export const fullAnalysisSchema = z.object({
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

export type FullDocumentAnalysis = z.infer<typeof fullAnalysisSchema>;

export const riskAnalysisSchema = z.object({
  summary: z.string(),
  riskLevel: z.enum(["low", "medium", "high"]),
  risks: z.array(z.string()).default([]),
  mitigations: z.array(z.string()).default([]),
});

export type RiskDocumentAnalysis = z.infer<typeof riskAnalysisSchema>;

export const summaryAnalysisSchema = z.object({
  summary: z.string(),
  documentType: z.string().optional(),
  keyPoints: z.array(z.string()).default([]),
});

export type SummaryDocumentAnalysis = z.infer<typeof summaryAnalysisSchema>;

/*
 * ANALYSIS OUTPUT UNION
 * Maps each analysis type to its output. The pipeline returns the union so
 * callers can narrow by `analysisType`.
 */
export type DocumentAnalysisOutputMap = {
  [ANALYSIS_TYPES.FULL]: FullDocumentAnalysis;
  [ANALYSIS_TYPES.RISK]: RiskDocumentAnalysis;
  [ANALYSIS_TYPES.SUMMARY]: SummaryDocumentAnalysis;
};

export type DocumentAnalysisOutput = DocumentAnalysisOutputMap[AnalysisType];

/*
 * SERVICE INPUT
 */

export type DocumentSource =
  | { filePath: string }
  | { fileBuffer: Buffer }
  | { fileUrl: string }
  | { text: string };

export interface RAGPipelineOptions {
  // Collection name to index chunks into. When omitted, the RAG step is
  // skipped and only LLM analysis runs.
  collectionName?: string;
  // Optional owning document id stamped into chunk metadata.
  documentId?: string;
  chunkSize?: number;
  overlapSize?: number;
}

export type ProcessDocumentInput = DocumentSource & {
  fileName: string;
  analysisType?: AnalysisType;
  rag?: RAGPipelineOptions;
};

export interface RAGPipelineResult {
  totalChunks: number;
  collectionName: string;
}

export interface ProcessDocumentResult {
  // Extracted document text (before truncation for the LLM).
  text: string;
  rag: RAGPipelineResult | null;
  analysis: DocumentAnalysisOutput;
}

/*
 * PROMPT BUILDERS
 * Each analysis type exposes a prompt builder keyed by the analysis type so
 * the analysis runner can dispatch generically.
 */
export interface AnalysisPrompt {
  schema: z.ZodType<DocumentAnalysisOutput>;
  buildPrompt(fileName: string, documentText: string): string;
}
