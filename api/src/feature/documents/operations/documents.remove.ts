import { db } from "@/lib/drizzle";
import { bookmarksTable } from "../documents.schema";
import { eq, and } from "drizzle-orm";

export async function removeBookmark(
  documentId: string,
  userId: string,
): Promise<void> {
  await db
    .delete(bookmarksTable)
    .where(
      and(
        eq(bookmarksTable.user_id, userId),
        eq(bookmarksTable.documentId, documentId),
      ),
    );
}
