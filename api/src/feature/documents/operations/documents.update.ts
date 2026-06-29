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
import { findDocumentById, findBookmarkById } from "./document.find";
import { toResult } from "@/lib/drizzle/drizzle.utils";
import { DbResult } from "@/lib/drizzle/drizzle.types";
import { removeBookmark } from "./documents.remove";

export async function updateDocument(
  documentId: string,
  updateData: Partial<NewDocument>,
): Promise<DbResult<Document>> {
  const [document] = await db
    .update(documentsTable)
    .set({
      ...updateData,
      updatedAt: new Date(),
    })
    .where(eq(documentsTable.id, documentId))
    .returning();
  return toResult(document);
}

export async function bookmarkDocument({
  documentId,
  user_id,
}: BookmarkDocumentParams): Promise<DbResult<Document>> {
  const documentResult = await findDocumentById(documentId);
  const bookmarkResult = await findBookmarkById(documentId, user_id);

  let bookmarked: boolean;

  if (bookmarkResult.ok) {
    // Bookmark exists, remove it
    await removeBookmark(documentId, user_id);
    bookmarked = false;
  } else {
    // Bookmark doesn't exist, create it
    await db
      .insert(bookmarksTable)
      .values({
        user_id,
        documentId,
      })
      .onConflictDoNothing();
    bookmarked = true;
  }

  return documentResult;
}

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
      return toResult(null);
    }

    await tx.insert(downloadsTable).values({
      user_id,
      document_id: documentId,
    });

    return await updateDocument(documentId, {
      downloadCount: document.downloadCount + 1,
    });
  });
}
