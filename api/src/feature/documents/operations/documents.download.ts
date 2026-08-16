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
import { toResult } from "@/lib/drizzle/drizzle.utils";
import { DbResult } from "@/lib/drizzle/drizzle.types";
import { updateDocument } from "./documents.update";

export async function downloadDocument({
  documentId,
  user_id,
}: DownloadDocumentParams): Promise<DbResult<Document>> {
  return db.transaction(async (tx) => {
    const [document] = await tx
      .select({
        id: documentsTable.id,
        storageUrl: documentsTable.storageUrl,
        downloadCount: documentsTable.downloadCount,
      })
      .from(documentsTable)
      .where(eq(documentsTable.id, documentId))
      .limit(1);

    if (!document) {
      return toResult<Document>(null);
    }

    await tx.insert(downloadsTable).values({
      user_id,
      document_id: documentId,
    });

    return await updateDocument("id", documentId, {
      downloadCount: document.downloadCount + 1,
    });
  });
}
