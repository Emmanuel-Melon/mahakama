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
  fullCitation?: string;
  url?: string;
  actName?: string;
  jurisdiction?: string;
  lastUpdated?: string;
  version?: number;
  documentId?: string;
}
