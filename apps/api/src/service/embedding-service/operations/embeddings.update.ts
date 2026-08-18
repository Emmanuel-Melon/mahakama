import { db } from "@/lib/drizzle";
import { eq } from "drizzle-orm";
import { logger } from "@/lib/logger";
import type { EmbeddingJobUpdate } from "../embeddings.types";
import { embeddingJobsTable } from "../embeddings.schema";
import { EmbeddingJobStatus } from "../embeddings.config";

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
    logger.error(
      { documentId, persistError },
      "Failed to mark embedding job as failed",
    );
  }
}
