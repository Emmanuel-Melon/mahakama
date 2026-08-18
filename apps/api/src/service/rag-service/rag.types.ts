import { z } from "zod";

/*
 * RETRIEVAL & QUERY TYPES
 * Types related to user queries, validation schemas, and retrieval options.
 */

export const ragQuerySchema = z.object({
  query: z
    .string()
    .min(3, { message: "Query must be at least 3 characters long" })
    .max(1000, { message: "Query must be at most 1000 characters long" })
    .trim(),
});

export type RagQueryInput = z.infer<typeof ragQuerySchema>;

export interface RetrievalOptions {
  collectionName: string;
  topK?: number;
  minSimilarity?: number;
}

/*
 * CONTEXT & SOURCE TYPES
 * Types for structured chunks, sources, and overall RAG context representation.
 */

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

export interface RagContextResult {
  context: RAGContext;
  conversationHistory: ConversationTurn[];
}

/*
 * CONVERSATION & ANALYSIS TYPES
 * Types for handling conversation history turns, citations, and staleness validation.
 */

export interface ConversationTurn {
  role: "user" | "assistant";
  content: string;
}

export type CitationScan = {
  citations: string[];
  hasCitation: boolean;
};

export interface ChunkStalenessInput {
  version?: number; // chunk's own version (from Chroma metadata)
  documentId?: string;
  lastUpdated?: string; // YYYY-MM-DD or ISO
  currentVersion?: number; // the document's current version in the DB
  now?: Date;
  stalenessMonths?: number;
}
