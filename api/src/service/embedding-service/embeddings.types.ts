export interface QueryEmbedding {
  model: string;
  embedding: number[][];
  query: string;
  metadata?: Record<string, string>;
}

export type QueryEmbeddingOptions = {
  collectionName: string;
  limit?: number;
};

export interface DocumentChunk {
  id: string;
  title: string;
  content: string;
  similarity?: number;
  section?: string;
  category?: string;
  source?: string;
}

export interface EmbeddingResult {
  id: number;
  title: string;
  content: string;
  embedding: number[];
  metadata?: Record<string, string>;
}
