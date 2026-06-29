export interface AddDocumentsParams {
  collectionName: string;
  documents: string[];
  ids?: string[];
  metadatas?: Record<string, any>[];
}

export interface QueryParams {
  collectionName: string;
  queryTexts: string | string[];
  nResults?: number;
}

export interface LawDocument {
  id: number;
  title: string;
  category: string;
  source: string;
  content: string;
}

export interface QuestionEmbedding {
  question: string;
  embedding: number[];
  category: string;
  timestamp: string;
  model: string;
  relevantLawIds?: number[]; // Reference to law IDs from laws.dataset.ts
}

export interface EmbeddingsData {
  embeddings: QuestionEmbedding[];
  metadata: {
    generatedAt: string;
    totalQuestions: number;
    successfulEmbeddings: number;
    embeddingModel: string;
  };
}
