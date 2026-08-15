import { db } from "@/lib/drizzle";
import { eq } from "drizzle-orm";
import { logger } from "@/lib/logger";
import type { DocumentChunk } from "./embeddings.types";
import {
  documentChunksTable,
  embeddingJobsTable,
} from "./embeddings.schema";

export const EmbeddingJobStatus = {
  PENDING: "pending",
  PROCESSING: "processing",
  COMPLETED: "completed",
  FAILED: "failed",
} as const;

export type EmbeddingJobStatus =
  (typeof EmbeddingJobStatus)[keyof typeof EmbeddingJobStatus];

type EmbeddingJobUpdate = {
  status: EmbeddingJobStatus;
  totalChunks?: number;
  processedChunks?: number;
  error?: string | null;
  startedAt?: Date | null;
  completedAt?: Date | null;
};

export async function upsertEmbeddingJob(
  documentId: string,
  values: EmbeddingJobUpdate,
) {
  const [existing] = await db
    .select({ id: embeddingJobsTable.id })
    .from(embeddingJobsTable)
    .where(eq(embeddingJobsTable.documentId, documentId))
    .limit(1);

  if (existing) {
    await db
      .update(embeddingJobsTable)
      .set(values)
      .where(eq(embeddingJobsTable.id, existing.id));
  } else {
    await db.insert(embeddingJobsTable).values({ documentId, ...values });
  }
}

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
      tokenCount: chunk.content.split(/\s+/).filter(Boolean).length,
    })),
  );

  logger.info(
    { documentId, chunkCount: chunks.length },
    "Persisted document chunks",
  );
  return chunks.length;
}

export async function markEmbeddingJobFailed(
  documentId: string,
  error: unknown,
) {
  try {
    await upsertEmbeddingJob(documentId, {
      status: EmbeddingJobStatus.FAILED,
      error: error instanceof Error ? error.message : String(error),
    });
  } catch (persistError) {
    // Never mask the original processing error with a persistence failure.
    logger.error(
      { documentId, persistError },
      "Failed to mark embedding job as failed",
    );
  }
}
