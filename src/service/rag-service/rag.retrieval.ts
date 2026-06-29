import { SimilarityResult, ChromaSimilarityResult } from "./rag.types";
import type { QueryEmbedding } from "@/service/embedding-service/embeddings.types";
import { searchEmbedding } from "@/service/embedding-service/embeddings.search";
import { logger } from "@/lib/logger";
import { toSimilarityResult } from "./rag.utils";

const COLLECTION_NAME = "legal_questions";
const RELEVANCE_THRESHOLD = 0.7;

export const getVectorizedLaws = async (
  queryEmbedding: number[],
): Promise<ChromaSimilarityResult[]> => {
  try {
    // Convert the query embedding to a string representation
    const queryString = queryEmbedding.join(",");

    // Query ChromaDB for similar documents
    const embeddings = await searchEmbedding(queryString, {
      collectionName: COLLECTION_NAME,
      limit: 10,
    });

    if (!embeddings?.ids?.[0]?.length) {
      logger.info("No embeddings found in ChromaDB");
      return [];
    }

    // Transform ChromaDB embeddings to ChromaSimilarityResult format
    const documentEmbeddings: ChromaSimilarityResult[] = [];

    // Process each result
    for (let i = 0; i < embeddings.ids[0].length; i++) {
      const id = embeddings.ids[0][i];
      const metadata = embeddings.metadatas?.[0]?.[i] || {};
      const document = embeddings.documents?.[0]?.[i] || "";
      const embedding = Array.isArray(embeddings.embeddings?.[0]?.[i])
        ? (embeddings.embeddings[0][i] as number[])
        : [];

      // Calculate similarity score (ChromaDB returns distances, convert to similarity)
      const distance =
        typeof embeddings.distances?.[0]?.[i] === "number"
          ? (embeddings.distances[0][i] as number)
          : 0;

      // Convert distance to similarity score (assuming cosine distance where 0 = most similar)
      // Clamp the score between 0 and 1
      const similarityScore = Math.max(0, Math.min(1, 1 - distance));

      // Skip embeddings below the threshold
      if (similarityScore < RELEVANCE_THRESHOLD) continue;

      documentEmbeddings.push({
        id: String(id || i),
        title: String(metadata?.title || `Document ${i + 1}`),
        content: String(document),
        embedding,
        category: metadata?.category ? String(metadata.category) : undefined,
        source: metadata?.source ? String(metadata.source) : undefined,
        model: metadata?.model ? String(metadata.model) : undefined,
        metadata,
        distance,
        similarityCosineScore: similarityScore,
        embeddingLength: embedding.length,
      });
    }

    logger.info(
      `Found ${documentEmbeddings.length} relevant laws in ChromaDB (after filtering)`,
    );
    return documentEmbeddings;
  } catch (error) {
    logger.error({ error }, "Error querying ChromaDB:");
    throw error;
  }
};

export const findRelevantDocuments = async (
  query: QueryEmbedding,
): Promise<SimilarityResult[]> => {
  try {
    const {
      embedding: [queryEmbedding],
    } = query;

    if (!queryEmbedding || !Array.isArray(queryEmbedding)) {
      throw new Error("Invalid query embedding");
    }

    // Get similar laws directly from ChromaDB
    const documentEmbeddings = await getVectorizedLaws(queryEmbedding);

    // Filter by relevance threshold and convert to SimilarityResult
    const relevantLaws = documentEmbeddings
      .filter((law) => law.similarityCosineScore >= RELEVANCE_THRESHOLD)
      .map(toSimilarityResult);

    logger.info(`Found ${relevantLaws.length} relevant laws`);
    return relevantLaws;
  } catch (error) {
    logger.error({ error }, "Error in findRelevantDocuments:");
    throw error;
  }
};

export const getMostRelevantDocument = <
  T extends { similarityCosineScore: number },
>(
  laws: T[],
): T | null => {
  if (!laws.length) return null;
  return laws.reduce((prev, current) =>
    prev.similarityCosineScore > current.similarityCosineScore ? prev : current,
  );
};
