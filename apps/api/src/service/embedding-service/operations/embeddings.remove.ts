import { db } from "@/lib/drizzle";
import { eq } from "drizzle-orm";
import { logger } from "@/lib/logger";
import { documentChunksTable, embeddingJobsTable } from "../embeddings.schema";

export async function removeDocumentEmbeddings(documentId: string) {
  // Cascading deletes defined in schema will clear chunks, 
  // but explicit cleanup functions keep operations symmetrical.
  await db
    .delete(documentChunksTable)
    .where(eq(documentChunksTable.documentId, documentId));

  await db
    .delete(embeddingJobsTable)
    .where(eq(embeddingJobsTable.documentId, documentId));

  logger.info({ documentId }, "Removed document embeddings and job state from database");
}