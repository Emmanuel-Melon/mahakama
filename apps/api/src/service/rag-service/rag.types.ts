import { z } from "zod";

export interface RAGChunk {
  content: string;
  title: string;
  section?: string | null;
  similarity: number;
  fullCitation?: string;
  url?: string;
  actName?: string;
  jurisdiction?: string;
  lastUpdated?: string;
  stale?: boolean;
}

export interface RAGSource {
  id: string;
  title: string;
  category?: string;
  source?: string;
  section?: string | null;
  similarity: number;
  fullCitation?: string;
  url?: string;
  actName?: string;
  jurisdiction?: string;
  lastUpdated?: string;
  content?: string;
  stale?: boolean;
}

export interface RAGContext {
  chunks: RAGChunk[];
  sources: RAGSource[];
}

export interface RetrievalOptions {
  collectionName: string;
  topK?: number;
  minSimilarity?: number;
}

export interface ConversationTurn {
  role: "user" | "assistant";
  content: string;
}

export const ragQuerySchema = z.object({
  query: z
    .string()
    .min(3, { message: "Query must be at least 3 characters long" })
    .max(1000, { message: "Query must be at most 1000 characters long" })
    .trim(),
});

export type RagQueryInput = z.infer<typeof ragQuerySchema>;
