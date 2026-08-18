export const EmbeddingJobStatus = {
  PENDING: "pending",
  PROCESSING: "processing",
  COMPLETED: "completed",
  FAILED: "failed",
} as const;

export type EmbeddingJobStatus =
  (typeof EmbeddingJobStatus)[keyof typeof EmbeddingJobStatus];

export const CHUNK_CONFIG = {
  DEFAULT_CHUNK_SIZE: 1000,
  DEFAULT_OVERLAP_SIZE: 200,
  // How far back from the hard chunk boundary we search for a word break,
  // as a fraction of chunkSize.
  WORD_BOUNDARY_TOLERANCE: 0.2,
  WORD_BOUNDARY: /\s/,
  // Split on legal section headers like "26. Increase of rent." at line start.
  SECTION_HEADER: /^\s*(\d{1,3})\.\s+([A-Z][^\n]+)\n/gm,
  // Non-global variant used to locate the first header (global regexes carry
  // `lastIndex` state, which would make `search` unreliable).
  SECTION_HEADER_FIRST: /^\s*(\d{1,3})\.\s+([A-Z][^\n]+)\n/m,
} as const;

export const EMBEDDING_CONFIG = {
  BATCH_SIZE: 20,
  ID_PREFIX: "law_",
} as const;
