import { db } from "@/lib/drizzle";
import { bookmarksTable } from "../corpus.schema";
import type { BookmarkCorpusParams, Corpus } from "../corpus.types";
import { findCorpusEntry, findBookmark } from "./corpus.find";
import { type DbResult } from "@/lib/drizzle/results/results.single";
import { eq, and } from "drizzle-orm";
import {
  BookmarkColumn,
  BookmarkColumnKey,
  RemoveBookmarkOptions,
} from "../corpus.types";

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

export async function bookmarkCorpusEntry({
  documentId,
  user_id,
}: BookmarkCorpusParams): Promise<DbResult<Corpus>> {
  const documentResult = await findCorpusEntry("id", documentId);
  const bookmarkResult = await findBookmark("documentId", documentId, {
    userId: user_id,
  });

  if (bookmarkResult.ok) {
    // Bookmark exists, remove it
    await removeBookmark("documentId", documentId, {
      userId: user_id,
    });
  } else {
    // Bookmark doesn't exist, create it
    await db
      .insert(bookmarksTable)
      .values({
        user_id,
        documentId,
      })
      .onConflictDoNothing();
  }

  return documentResult;
}
