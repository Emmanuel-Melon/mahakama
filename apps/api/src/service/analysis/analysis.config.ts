export const DOCUMENT_ANALYSIS_CONFIG = {
  // Cap the number of document characters fed to the model to stay within
  // the model context window.
  MAX_DOCUMENT_CHARS: 60000,
  // Default chunk size for the RAG indexing step of the pipeline.
  CHUNK_SIZE: 1000,
  CHUNK_OVERLAP: 200,
} as const;

export const ANALYSIS_TYPES = {
  FULL: "full",
  RISK: "risk",
  SUMMARY: "summary",
} as const;

export type AnalysisType = (typeof ANALYSIS_TYPES)[keyof typeof ANALYSIS_TYPES];

export const ANALYSIS_TYPE_VALUES = Object.values(ANALYSIS_TYPES) as [
  AnalysisType,
  ...AnalysisType[],
];
