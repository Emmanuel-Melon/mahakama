import { z } from "zod";

export interface RAGContext {
  chunks: Array<{
    content: string;
    documentTitle: string;
    section: string | null;
    similarity: number;
  }>;
  sources: Array<{
    documentId: string;
    documentTitle: string;
    sections: string[];
  }>;
}

export interface RetrievalOptions {
  collectionName: string;
  topK?: number;
  minSimilarity?: number;
  documentTypes?: string[]; // Filter by document type
}

export interface SimilarityResult {
  id: number;
  title: string;
  content: string;
  embeddingLength: number;
  similarityCosineScore: number;
  category?: string;
  source?: string;
}

// Local interface that extends SimilarityResult but allows string IDs
export interface ChromaSimilarityResult extends Omit<
  SimilarityResult,
  "id" | "embeddingLength"
> {
  id: string; // Allow string IDs from ChromaDB
  title: string;
  content: string;
  embedding: number[];
  category?: string;
  source?: string;
  model?: string;
  metadata?: Record<string, any>;
  distance?: number;
  similarityCosineScore: number;
  embeddingLength: number;
}

export const ragQuerySchema = z.object({
  query: z
    .string()
    .min(3, { message: "Query must be at least 3 characters long" })
    .max(1000, { message: "Query must be at most 1000 characters long" })
    .trim(),
});

export type RagQueryInput = z.infer<typeof ragQuerySchema>;
