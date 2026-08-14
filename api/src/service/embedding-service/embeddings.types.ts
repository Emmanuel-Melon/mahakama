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
