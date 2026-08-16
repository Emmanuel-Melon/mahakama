import { db } from "@/lib/drizzle";
import { documentsTable } from "../documents.schema";
import type {
  Document,
  DocumentColumn,
  DocumentColumnKey,
} from "../documents.types";
import { eq } from "drizzle-orm";
import {
  executeSingle,
  type DbResult,
} from "@/lib/drizzle/results/results.single";

export const removeDocument = async <K extends DocumentColumnKey>(
  field: K,
  value: DocumentColumn[K]["_"]["data"],
): Promise<DbResult<Document>> => {
  return executeSingle(
    db
      .delete(documentsTable)
      .where(eq(documentsTable[field], value))
      .returning()
      .then(([result]) => result),
  );
};
