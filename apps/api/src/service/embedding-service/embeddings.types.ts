import { EmbeddingJobStatus } from "./embeddings.config";

/*
 * CHUNK & DOCUMENT CONTENT TYPES
 * Types related to raw file contents, text splitting, and document chunks.
 */

export type FileContent = {
  documentId: string;
  text: string;
  title?: string;
};

export type Section = {
  section: string;
  title: string;
  content: string;
};

export type ChunkingOptions = {
  chunkSize: number; // characters
  overlapSize: number;
};

/*
 * EMBEDDING & VECTOR STORAGE TYPES
 * Types used for representing chunks, configuring queries, and tracking batch progress.
 */

export interface DocumentChunk {
  id: string;
  title: string;
  content: string;
  similarity?: number;
  section?: string;
  category?: string;
  source?: string;
  fullCitation?: string;
  url?: string;
  actName?: string;
  jurisdiction?: string;
  lastUpdated?: string;
  version?: number;
  documentId?: string;
}

export type QueryEmbeddingOptions = {
  collectionName: string;
  limit?: number;
};

export type EmbeddingBatchProgress = {
  batchIndex: number; // 1-based
  totalBatches: number;
  processedChunks: number;
  totalChunks: number;
};

/*
 * JOB PROCESSING TYPES
 * Types for tracking background embedding job states and updates.
 */

export type EmbeddingJobUpdate = {
  status: EmbeddingJobStatus;
  totalChunks?: number;
  processedChunks?: number;
  error?: string | null;
  startedAt?: Date | null;
  completedAt?: Date | null;
};
