import { db } from "@/lib/drizzle";
import {
  documentsTable,
  bookmarksTable,
  downloadsTable,
} from "../corpus.schema";
import type {
  BookmarkCorpusParams,
  Corpus,
  DownloadCorpusParams,
  NewCorpus,
} from "../corpus.types";
import { eq } from "drizzle-orm";
import { findCorpusEntry, findBookmark } from "./corpus.find";
import {
  executeSingle,
  type DbResult,
} from "@/lib/drizzle/results/results.single";
import { updateCorpusEntry } from "./corpus.update";

export async function downloadCorpusEntry({
  documentId,
  user_id,
}: DownloadCorpusParams): Promise<DbResult<Corpus>> {
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

    return await updateCorpusEntry("id", documentId, {
      downloadCount: documentResult.data.downloadCount + 1,
    });
  });
}
