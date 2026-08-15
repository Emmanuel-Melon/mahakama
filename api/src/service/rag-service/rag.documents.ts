import { db } from "@/lib/drizzle";
import { documentsTable } from "@/feature/documents/documents.schema";
import { inArray } from "drizzle-orm";

/**
 * Load the current `version` of the given documents so retrieval can flag
 * chunks that belong to an older version (metadata-updates.md U4.1). Returns
 * an empty map when there is nothing to look up (e.g. seed chunks that carry
 * no `document_id`).
 */
export const loadDocumentVersions = async (
  documentIds: string[],
): Promise<Map<string, number>> => {
  if (documentIds.length === 0) return new Map();

  const rows = await db
    .select({
      id: documentsTable.id,
      version: documentsTable.version,
    })
    .from(documentsTable)
    .where(inArray(documentsTable.id, documentIds));

  return new Map(
    rows.map((row) => [row.id, row.version ?? 1] as [string, number]),
  );
};
