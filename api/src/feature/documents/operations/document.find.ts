import { db } from "@/lib/drizzle";
import { documentsTable, bookmarksTable } from "../documents.schema";
import { eq, and, desc, sql } from "drizzle-orm";
import {
  Document,
  DocumentShareInfo,
  ShareDocumentParams,
  Bookmark,
  DocumentsFilters,
} from "../documents.types";
import { toManyResult, toResult } from "@/lib/drizzle/drizzle.utils";
import { DbManyResult, DbResult } from "@/lib/drizzle/drizzle.types";
import { paginate } from "@/lib/drizzle/drizzle.paginate";

export async function findDocumentById(
  id: string,
): Promise<DbResult<Document>> {
  const [document] = await db
    .select()
    .from(documentsTable)
    .where(eq(documentsTable.id, id));
  return toResult(document);
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

export async function findBookmarkById(
  documentId: string,
  userId: string,
): Promise<DbResult<Bookmark>> {
  const [bookmark] = await db
    .select()
    .from(bookmarksTable)
    .where(
      and(
        eq(bookmarksTable.user_id, userId),
        eq(bookmarksTable.documentId, documentId),
      ),
    )
    .limit(1);
  return toResult(bookmark);
}

export async function findDocuments(query: DocumentsFilters): Promise<DbManyResult<Document>> {
  const filters = [];

  if (query.type) {
    filters.push(sql`LOWER(${documentsTable.type}) = LOWER(${query.type})`);
  }

  const result = await paginate<"documentsTable", Document>("documentsTable", documentsTable, {
    ...query,
    filters,
    search: {
      q: query.q,
      columns: [documentsTable.title, documentsTable.description],
    },
  });

  return toManyResult(result);
}
