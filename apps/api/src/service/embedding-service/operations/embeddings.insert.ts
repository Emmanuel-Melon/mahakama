import { db } from "@/lib/drizzle";
import { eq } from "drizzle-orm";
import { logger } from "@/lib/logger";
import type {
  DocumentChunk,
  EmbeddingBatchProgress,
  QueryEmbeddingOptions,
} from "../embeddings.types";
import { documentChunksTable } from "../embeddings.schema";
import { EMBEDDING_CONFIG } from "../embeddings.config";
import { calculateTokenCount } from "@/lib/js-tiktoken";
import { embeddingProvider, vectorStore } from "../embeddings.factory";
import { processInBatches } from "@/lib/batch";
import { buildChunkId, buildChunkMetadata } from "../embeddings.utils";

export async function saveDocumentChunks(
  documentId: string,
  chunks: DocumentChunk[],
): Promise<number> {
  if (!chunks.length) {
    return 0;
  }

  // Idempotent across job retries — clear any rows from a previous attempt.
  await db
    .delete(documentChunksTable)
    .where(eq(documentChunksTable.documentId, documentId));

  await db.insert(documentChunksTable).values(
    chunks.map((chunk, index) => ({
      vectorId: buildChunkId(chunk),
      documentId,
      content: chunk.content,
      chunkIndex: index,
      section: chunk.section ?? null,
      actName: chunk.actName ?? null,
      fullCitation: chunk.fullCitation ?? null,
      url: chunk.url ?? null,
      jurisdiction: chunk.jurisdiction ?? null,
      lastUpdated: chunk.lastUpdated ?? null,
      version: chunk.version ?? null,
      tokenCount: calculateTokenCount(chunk.content),
    })),
  );

  logger.info(
    { documentId, chunkCount: chunks.length },
    "Persisted document chunks",
  );
  return chunks.length;
}

export const generateDocumentEmbeddings = async (
  documentChunks: DocumentChunk[],
  options: QueryEmbeddingOptions,
  onBatchProgress?: (progress: EmbeddingBatchProgress) => void,
) => {
  const { collectionName } = options;

  return processInBatches({
    items: documentChunks,
    batchSize: EMBEDDING_CONFIG.BATCH_SIZE,
    onProgress: onBatchProgress,
    processBatch: async (batchChunks) => {
      const texts = batchChunks.map((c) => `${c.title}. ${c.content}`);
      const embeddings = await embeddingProvider.embed(texts);

      if (embeddings.length !== batchChunks.length) {
        throw new Error(
          `Embedding count mismatch: requested ${batchChunks.length} embeddings, provider "${embeddingProvider.name}" returned ${embeddings.length}`,
        );
      }

      const records = batchChunks.map((chunk, i) => ({
        id: buildChunkId(chunk),
        document: texts[i],
        embedding: embeddings[i],
        metadata: buildChunkMetadata(chunk, embeddingProvider),
      }));

      await vectorStore.addDocuments(collectionName, records);

      // Retry-safe verification, same guarantee as the original chromaClient
      // version — checks stored ids regardless of whether this attempt or an
      // earlier retry wrote them.
      const stored = await vectorStore.getDocumentsByIds(
        collectionName,
        records.map((r) => r.id),
      );
      if ((stored?.ids?.length ?? 0) < records.length) {
        throw new Error(
          `Embedding verification failed: expected ${records.length} documents in "${collectionName}" but only ${stored?.ids?.length ?? 0} were stored`,
        );
      }

      logger.info(
        {
          collectionName,
          count: records.length,
          provider: embeddingProvider.name,
        },
        "Persisted embedding batch",
      );
    },
  });
};
