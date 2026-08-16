import { db } from "@/lib/drizzle";
import { documentsTable, bookmarksTable } from "../documents.schema";
import { eq, and, sql } from "drizzle-orm";
import {
  Document,
  DocumentShareInfo,
  ShareDocumentParams,
  Bookmark,
  DocumentsFilters,
  BookmarkColumn,
  BookmarkColumnKey,
  DocumentColumn,
  DocumentColumnKey,
  FindBookmarkOptions,
} from "../documents.types";
import {
  executeSingle,
  type DbResult,
} from "@/lib/drizzle/results/results.single";
import { toManyResult } from "@/lib/drizzle/drizzle.utils";
import { DbManyResult } from "@/lib/drizzle/drizzle.types";
import { paginate } from "@/lib/drizzle/drizzle.paginate";

export const findDocument = async <K extends DocumentColumnKey>(
  field: K,
  value: DocumentColumn[K]["_"]["data"],
): Promise<DbResult<Document>> => {
  return executeSingle(
    db.query.documentsTable.findFirst({
      where: eq(documentsTable[field], value),
    }),
  );
};

export const findBookmark = async <K extends BookmarkColumnKey>(
  field: K,
  value: BookmarkColumn[K]["_"]["data"],
  options?: FindBookmarkOptions,
): Promise<DbResult<Bookmark>> => {
  const conditions = [eq(bookmarksTable[field], value)];

  if (options?.userId) {
    conditions.push(eq(bookmarksTable.user_id, options.userId));
  }

  return executeSingle(
    db
      .select()
      .from(bookmarksTable)
      .where(and(...conditions))
      .limit(1)
      .then(([result]) => result),
  );
};

export async function findDocuments(
  query: DocumentsFilters,
): Promise<DbManyResult<Document>> {
  const filters = [];

  if (query.type) {
    filters.push(sql`LOWER(${documentsTable.type}) = LOWER(${query.type})`);
  }

  const result = await paginate<"documentsTable", Document>(
    "documentsTable",
    documentsTable,
    {
      ...query,
      filters,
      search: {
        q: query.q,
        columns: [documentsTable.title, documentsTable.description],
      },
    },
  );

  return toManyResult(result);
}

export async function getDocumentShareInfo({
  documentId,
}: ShareDocumentParams): Promise<DocumentShareInfo> {
  const [document] = await db
    .select({
      id: documentsTable.id,
      title: documentsTable.title,
      description: documentsTable.description,
      type: documentsTable.type,
    })
    .from(documentsTable)
    .where(eq(documentsTable.id, documentId))
    .limit(1);

  const shareableLink = `https://mahakama.app/documents/${documentId}`;

  const shareInfo: DocumentShareInfo = {
    documentId,
    title: document.title,
    shareableLink,
    socialLinks: {
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareableLink)}&text=${encodeURIComponent(document.title)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareableLink)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareableLink)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${document.title} - ${shareableLink}`)}`,
      email: `mailto:?subject=${encodeURIComponent(document.title)}&body=${encodeURIComponent(`Check out this document: ${shareableLink}`)}`,
    },
  };

  return shareInfo;
}
