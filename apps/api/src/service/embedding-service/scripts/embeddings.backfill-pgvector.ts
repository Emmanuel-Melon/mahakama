import { eq, isNull } from "drizzle-orm";
import { db } from "@/lib/drizzle";
import { chromaClient } from "@/lib/chroma";
import { documentChunksTable } from "../embeddings.schema";
import { logger } from "@/lib/logger";
import { processInBatches } from "@/lib/batch";
import { EMBEDDING_CONFIG } from "../embeddings.config";

export const backfillPgVectorFromChroma = async (collectionName: string) => {
  const rowsNeedingBackfill = await db
    .select({ id: documentChunksTable.id })
    .from(documentChunksTable)
    .where(isNull(documentChunksTable.embedding));

  logger.info(
    { count: rowsNeedingBackfill.length },
    "Starting pgvector backfill from Chroma",
  );

  return processInBatches({
    items: rowsNeedingBackfill,
    batchSize: 50,
    processBatch: async (batch) => {
      const chromaIds = batch.map(
        (r) => `${EMBEDDING_CONFIG.ID_PREFIX}${r.id}`,
      );
      const chromaResult = await chromaClient.getDocumentsByIds(
        collectionName,
        chromaIds,
      );

      await Promise.all(
        batch.map(async (row, i) => {
          const embedding = chromaResult.embeddings?.[i];
          if (!embedding) {
            logger.warn(
              { id: row.id },
              "Missing from Chroma — cannot backfill, needs re-embedding",
            );
            return;
          }
          await db
            .update(documentChunksTable)
            .set({
              embedding,
              embeddingProvider: "backfill-chroma",
              vectorId: `${EMBEDDING_CONFIG.ID_PREFIX}${row.id}`,
            })
            .where(eq(documentChunksTable.id, row.id));
        }),
      );
    },
  });
};
