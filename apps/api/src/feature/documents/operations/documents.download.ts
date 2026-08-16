import { db } from "@/lib/drizzle";
import {
  documentsTable,
  bookmarksTable,
  downloadsTable,
} from "../documents.schema";
import type {
  BookmarkDocumentParams,
  Document,
  DownloadDocumentParams,
  NewDocument,
} from "../documents.types";
import { eq } from "drizzle-orm";
import { findDocument, findBookmark } from "./documents.find";
import {
  executeSingle,
  type DbResult,
} from "@/lib/drizzle/results/results.single";
import { updateDocument } from "./documents.update";

export async function downloadDocument({
  documentId,
  user_id,
}: DownloadDocumentParams): Promise<DbResult<Document>> {
  return db.transaction(async (tx) => {
    const documentResult = await executeSingle(
      tx
        .select({
          id: documentsTable.id,
          storageUrl: documentsTable.storageUrl,
          downloadCount: documentsTable.downloadCount,
        })
        .from(documentsTable)
        .where(eq(documentsTable.id, documentId))
        .limit(1)
        .then(([document]) => document),
    );

    if (!documentResult.ok) {
      return documentResult;
    }

    await tx.insert(downloadsTable).values({
      user_id,
      document_id: documentId,
    });

    return await updateDocument("id", documentId, {
      downloadCount: documentResult.data.downloadCount + 1,
    });
  });
}
