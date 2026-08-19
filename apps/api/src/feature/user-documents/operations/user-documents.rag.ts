import { chromaClient } from "@/lib/chroma";
import { getUserDocumentCollectionName } from "@/lib/chroma/chroma.config";
import { logger } from "@/lib/logger";
import { embeddingProvider } from "@/service/embedding-service/embeddings.factory";
import { DocumentSource } from "../user-documents.types";
import type {
  RAGChunk,
  RAGSource,
  RAGContext,
} from "@/service/rag-service/rag.types";
import { UserDocumentConfig } from "../user-documents.config";

/**
 * Retrieve context from a user's session document collection
 *
 * @param sessionId - The chat session ID
 * @param query - The user's query
 * @param topK - Number of results to retrieve
 * @returns RAG context from user document
 */
export async function retrieveUserDocumentContext(
  sessionId: string,
  query: string,
  topK: number = UserDocumentConfig.QUERY_TOP_K_WITH_USER_DOC,
): Promise<RAGContext> {
  const collectionName = getUserDocumentCollectionName(sessionId);

  try {
    // Check if collection exists and has documents
    const count = await chromaClient.countCollection(collectionName);
    if (count === 0) {
      return { chunks: [], sources: [] };
    }

    // Query the user document collection
    const [queryEmbedding] = await embeddingProvider.embed([query]);
    const results = await chromaClient.query({
      collectionName,
      queryEmbeddings: [queryEmbedding],
      nResults: Math.min(topK, count),
    });

    if (!results?.ids?.length) {
      return { chunks: [], sources: [] };
    }

    const chunks: RAGChunk[] = [];
    const seenSources = new Map<string, RAGSource>();

    for (let i = 0; i < results.ids.length; i++) {
      const metadata = (results.metadatas?.[i] ?? {}) as Record<
        string,
        unknown
      >;
      const document = String(results.documents?.[i] ?? "");
      const distance =
        typeof results.distances?.[i] === "number" ? results.distances[i]! : 0;
      const similarity = Math.max(0, Math.min(1, 1 - distance));

      // User documents don't have a minimum similarity threshold
      // since they're the user's own document
      if (similarity < 0.1) continue;

      const id = String(results.ids[i]);
      const title = String(metadata.filename ?? "Uploaded Document");
      const section = metadata.section ? String(metadata.section) : null;
      const chunkIndex = metadata.chunkIndex
        ? Number(metadata.chunkIndex)
        : undefined;

      chunks.push({
        content: document,
        title,
        section,
        similarity,
        fullCitation: undefined,
        url: undefined,
        actName: undefined,
        jurisdiction: undefined,
        lastUpdated: undefined,
        stale: false, // User documents are ephemeral, never stale
      });

      const sourceKey = `user_doc_${sessionId}_${chunkIndex}`;
      if (!seenSources.has(sourceKey)) {
        seenSources.set(sourceKey, {
          id,
          title,
          category: undefined,
          source: DocumentSource.USER_DOCUMENT,
          section,
          similarity,
          fullCitation: undefined,
          url: undefined,
          actName: undefined,
          jurisdiction: undefined,
          lastUpdated: undefined,
          content: document,
          stale: false,
        });
      }
    }

    logger.info(
      {
        sessionId,
        chunks: chunks.length,
        sources: seenSources.size,
        query,
      },
      "Retrieved user document context",
    );

    return { chunks, sources: Array.from(seenSources.values()) };
  } catch (error) {
    logger.error(
      { sessionId, error },
      "Failed to retrieve user document context",
    );
    return { chunks: [], sources: [] };
  }
}

/**
 * Merge user document context with legal corpus context
 *
 * @param userDocContext - Context from user's uploaded document
 * @param legalContext - Context from legal corpus
 * @returns Merged context with source attribution
 */
export function mergeDocumentContexts(
  userDocContext: RAGContext,
  legalContext: RAGContext,
): RAGContext {
  // Combine chunks, user document chunks first
  const mergedChunks = [
    ...userDocContext.chunks.map((chunk) => ({
      ...chunk,
      // Add source indicator to title for prompt
      title: `[USER DOCUMENT] ${chunk.title}`,
    })),
    ...legalContext.chunks.map((chunk) => ({
      ...chunk,
      // Add source indicator to title for prompt
      title: `[LEGAL CORPUS] ${chunk.title}`,
    })),
  ];

  // Combine sources
  const mergedSources = [...userDocContext.sources, ...legalContext.sources];

  return {
    chunks: mergedChunks,
    sources: mergedSources,
  };
}

/**
 * Check if a session has an uploaded user document
 *
 * @param sessionId - The chat session ID
 * @returns True if the session has a user document
 */
export async function sessionHasUserDocument(
  sessionId: string,
): Promise<boolean> {
  const collectionName = getUserDocumentCollectionName(sessionId);

  try {
    const count = await chromaClient.countCollection(collectionName);
    return count > 0;
  } catch {
    return false;
  }
}
