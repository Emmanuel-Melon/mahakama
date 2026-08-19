export const COLLECTION_NAME = "legal_questions";

// Map category names between questions and laws
export const CATEGORY_MAP: Record<string, string[]> = {
  Citizenship: ["Citizenship"],
  Rights: ["Human Rights"],
  Property: ["Land"],
  Housing: ["Housing"],
  Employment: ["Employment"],
  General: ["General", "Voting & Elections", "Environment", "Legislation"],
};

/**
 * User Document Collection Naming
 *
 * Session-scoped collections for user-uploaded documents.
 * Format: `user_docs_{sessionId}`
 *
 * Future: User-scoped collections (premium tier)
 * Format: `user_docs_{userId}`
 */
export const USER_DOCUMENT_COLLECTION_PREFIX = "user_docs_";

/**
 * Generate a ChromaDB collection name for a user document session
 * @param sessionId - The chat session ID
 * @returns Collection name in format `user_docs_{sessionId}`
 */
export function getUserDocumentCollectionName(sessionId: string): string {
  return `${USER_DOCUMENT_COLLECTION_PREFIX}${sessionId}`;
}

/**
 * Extract session ID from a user document collection name
 * @param collectionName - Collection name in format `user_docs_{sessionId}`
 * @returns Session ID or null if not a user document collection
 */
export function extractSessionIdFromCollectionName(
  collectionName: string,
): string | null {
  if (collectionName.startsWith(USER_DOCUMENT_COLLECTION_PREFIX)) {
    return collectionName.slice(USER_DOCUMENT_COLLECTION_PREFIX.length);
  }
  return null;
}

/**
 * Check if a collection name is a user document collection
 * @param collectionName - The collection name to check
 * @returns True if this is a user document collection
 */
export function isUserDocumentCollection(collectionName: string): boolean {
  return collectionName.startsWith(USER_DOCUMENT_COLLECTION_PREFIX);
}
