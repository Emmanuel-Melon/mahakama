import { logger } from "@/lib/logger";
import { chromaClient } from "@/lib/chroma";
import {
  getUserDocumentCollectionName,
  isUserDocumentCollection,
  extractSessionIdFromCollectionName,
} from "@/lib/chroma/chroma.config";
import { UserDocumentConfig } from "../user-documents.config";

/**
 * Cleanup job handler for expired user document collections
 *
 * This job runs periodically and deletes user document collections
 * that have exceeded the 24-hour TTL.
 */
export async function cleanupExpiredUserDocuments(): Promise<{
  checked: number;
  deleted: number;
  errors: number;
}> {
  const startTime = Date.now();
  const ttlMs = UserDocumentConfig.SESSION_TTL_MS;
  const cutoffTime = new Date(startTime - ttlMs);

  logger.info(
    { cutoffTime: cutoffTime.toISOString(), ttlMs },
    "Starting user document cleanup",
  );

  let checked = 0;
  let deleted = 0;
  let errors = 0;

  try {
    // Note: ChromaDB doesn't have a listCollections API exposed in the current
    // client, so we need to track collections differently. For now, we'll
    // implement a heuristic approach:
    // 1. We can't list all collections, so we'll rely on lazy deletion
    // 2. When a user accesses a session, we check if the collection exists
    // 3. For cleanup, we'll implement a different approach

    // TODO: Implement collection tracking in PostgreSQL for proper cleanup
    // For now, we'll log that cleanup ran and return
    logger.info(
      { checked, deleted, errors, duration: Date.now() - startTime },
      "User document cleanup completed (no-op implementation)",
    );

    return { checked, deleted, errors };
  } catch (error) {
    logger.error({ error }, "Failed to run user document cleanup");
    throw error;
  }
}

/**
 * Delete a specific user document collection by session ID
 *
 * @param sessionId - The chat session ID
 * @returns True if deleted, false if not found or error
 */
export async function deleteUserDocumentCollection(
  sessionId: string,
): Promise<boolean> {
  const collectionName = getUserDocumentCollectionName(sessionId);

  try {
    const count = await chromaClient.countCollection(collectionName);

    if (count === 0) {
      logger.debug(
        { sessionId, collectionName },
        "User document collection not found or empty",
      );
      return false;
    }

    // Get all document IDs in the collection
    const peek = await chromaClient.peekCollection(collectionName);
    const ids = peek.ids as string[];

    if (ids.length > 0) {
      await chromaClient.deleteDocuments(collectionName, { ids });
    }

    logger.info(
      { sessionId, collectionName, deletedChunks: ids.length },
      "User document collection deleted",
    );

    return true;
  } catch (error) {
    // Collection doesn't exist - not an error
    if (error instanceof Error && error.message.includes("does not exist")) {
      return false;
    }

    logger.error(
      { sessionId, collectionName, error },
      "Failed to delete user document collection",
    );
    return false;
  }
}

/**
 * Check if a user document collection has expired
 *
 * @param sessionId - The chat session ID
 * @param uploadedAt - ISO timestamp of when the document was uploaded
 * @returns True if the collection has expired
 */
export function isUserDocumentExpired(uploadedAt: string): boolean {
  const uploadTime = new Date(uploadedAt).getTime();
  const now = Date.now();
  return now - uploadTime > UserDocumentConfig.SESSION_TTL_MS;
}
