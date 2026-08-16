import { db } from "@/lib/drizzle";
import { documentsTable } from "../documents.schema";
import type {
  Document,
  DocumentColumn,
  DocumentColumnKey,
  UpdateDocument,
} from "../documents.types";
import { eq } from "drizzle-orm";
import {
  executeSingle,
  type DbResult,
} from "@/lib/drizzle/results/results.single";

export const updateDocument = async <K extends DocumentColumnKey>(
  field: K,
  value: DocumentColumn[K]["_"]["data"],
  updateData: UpdateDocument,
): Promise<DbResult<Document>> => {
  return executeSingle(
    db
      .update(documentsTable)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(documentsTable[field], value))
      .returning()
      .then(([result]) => result),
  );
};
