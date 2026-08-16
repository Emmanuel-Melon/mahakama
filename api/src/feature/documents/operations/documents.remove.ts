import { db } from "@/lib/drizzle";
import { documentsTable } from "../documents.schema";
import type {
  Document,
  DocumentColumn,
  DocumentColumnKey,
} from "../documents.types";
import { eq } from "drizzle-orm";
import { DbResult } from "@/lib/drizzle/drizzle.types";
import { toSingleResult } from "@/lib/drizzle/drizzle.utils";

export const removeDocument = async <K extends DocumentColumnKey>(
  field: K,
  value: DocumentColumn[K]["_"]["data"],
): Promise<DbResult<Document>> => {
  const deletedDocument = await db
    .delete(documentsTable)
    .where(eq(documentsTable[field], value))
    .returning()
    .then(([result]) => result);

  return toSingleResult(deletedDocument);
};
