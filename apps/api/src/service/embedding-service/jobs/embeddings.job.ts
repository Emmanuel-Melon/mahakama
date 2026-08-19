import { Job } from "bullmq";
import { and, isNull, isNotNull, eq, lt, inArray } from "drizzle-orm";
import { db } from "@/lib/drizzle";
import { logger } from "@/lib/logger";
import { chromaClient } from "@/lib/chroma";
import {
  documentChunksTable,
  shadowWriteFailuresTable,
} from "../embeddings.schema";
import type { ShadowReplayPaylod, VectorRecord } from "../embeddings.types";
import { chromaStore } from "../stores/chroma.store";
import { pgVectorStore } from "../stores/pgvector.store";
import { readRecordsFromPrimary } from "../stores";

const MAX_RETRIES = 5;
const BATCH_SIZE = 100;
const RESOLVED_RETENTION_DAYS = 7;

const SHADOW_STORES: Record<string, typeof chromaStore | typeof pgVectorStore> =
  {
    chroma: chromaStore,
    pgvector: pgVectorStore,
  };

export class EmbeddingsJobHandler {
  static async handleReplay(_data: ShadowReplayPaylod, _job?: Job) {
    const failures = await db
      .select()
      .from(shadowWriteFailuresTable)
      .where(
        and(
          isNull(shadowWriteFailuresTable.resolvedAt),
          lt(shadowWriteFailuresTable.retryCount, MAX_RETRIES),
        ),
      )
      .orderBy(shadowWriteFailuresTable.retryCount)
      .limit(BATCH_SIZE);

    if (failures.length === 0) {
      return { processed: 0, resolved: 0, failed: 0 };
    }

    logger.info({ count: failures.length }, "Processing shadow write failures");

    let resolved = 0;
    let failed = 0;

    for (const failure of failures) {
      const shadow = SHADOW_STORES[failure.shadowStore];
      if (!shadow) {
        logger.warn(
          { store: failure.shadowStore, id: failure.id },
          "Unknown shadow store — marking as resolved to stop retries",
        );
        await db
          .update(shadowWriteFailuresTable)
          .set({ resolvedAt: new Date() })
          .where(eq(shadowWriteFailuresTable.id, failure.id));
        continue;
      }

      try {
        const records = await readRecordsFromPrimary(
          failure.primaryStore,
          failure.collectionName,
          failure.recordIds,
        );

        if (records.length === 0) {
          logger.warn(
            { id: failure.id, ids: failure.recordIds },
            "No readable records from primary — marking resolved",
          );
          await db
            .update(shadowWriteFailuresTable)
            .set({ resolvedAt: new Date() })
            .where(eq(shadowWriteFailuresTable.id, failure.id));
          resolved++;
          continue;
        }

        await shadow.addDocuments(failure.collectionName, records);

        await db
          .update(shadowWriteFailuresTable)
          .set({ resolvedAt: new Date() })
          .where(eq(shadowWriteFailuresTable.id, failure.id));

        resolved++;
        logger.info(
          {
            id: failure.id,
            store: failure.shadowStore,
            count: records.length,
          },
          "Shadow write replay succeeded",
        );
      } catch (err) {
        failed++;
        await db
          .update(shadowWriteFailuresTable)
          .set({
            retryCount: failure.retryCount + 1,
            lastError: err instanceof Error ? err.message : String(err),
          })
          .where(eq(shadowWriteFailuresTable.id, failure.id));

        if (failure.retryCount + 1 >= MAX_RETRIES) {
          logger.warn(
            { id: failure.id, store: failure.shadowStore },
            "Shadow write failure exceeded max retries — will not retry again",
          );
        }
      }
    }

    // Housekeeping: delete resolved failures older than 7 days
    const cutoff = new Date(Date.now() - RESOLVED_RETENTION_DAYS * 86_400_000);
    const deleted = await db
      .delete(shadowWriteFailuresTable)
      .where(
        and(
          isNotNull(shadowWriteFailuresTable.resolvedAt),
          lt(shadowWriteFailuresTable.resolvedAt, cutoff),
        ),
      );

    if (deleted.rowCount && deleted.rowCount > 0) {
      logger.info(
        { deleted: deleted.rowCount },
        "Cleaned up old resolved failures",
      );
    }

    logger.info(
      { processed: failures.length, resolved, failed },
      "Shadow write replay complete",
    );

    return { processed: failures.length, resolved, failed };
  }
}
