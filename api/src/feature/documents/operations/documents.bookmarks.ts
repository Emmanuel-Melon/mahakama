import { db } from "@/lib/drizzle";
import { bookmarksTable } from "../documents.schema";
import type { BookmarkDocumentParams, Document } from "../documents.types";
import { findDocument, findBookmark } from "./documents.find";
import { toSingleResult } from "@/lib/drizzle/drizzle.utils";
import { DbResult } from "@/lib/drizzle/drizzle.types";
import { eq, and } from "drizzle-orm";
import {
  BookmarkColumn,
  BookmarkColumnKey,
  RemoveBookmarkOptions,
} from "../documents.types";

export const removeBookmark = async <K extends BookmarkColumnKey>(
  field: K,
  value: BookmarkColumn[K]["_"]["data"],
  options?: RemoveBookmarkOptions,
): Promise<void> => {
  const conditions = [eq(bookmarksTable[field], value)];

  if (options?.userId) {
    conditions.push(eq(bookmarksTable.user_id, options.userId));
  }

  await db.delete(bookmarksTable).where(and(...conditions));
};

export async function bookmarkDocument({
  documentId,
  user_id,
}: BookmarkDocumentParams): Promise<DbResult<Document>> {
  const documentResult = await findDocument("id", documentId);
  const bookmarkResult = await findBookmark("documentId", documentId, {
    userId: user_id,
  });

  let bookmarked: boolean;

  if (bookmarkResult.ok) {
    // Bookmark exists, remove it
    await removeBookmark("documentId", documentId, {
      userId: user_id,
    });
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
