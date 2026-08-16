import { db } from "@/lib/drizzle";
import { documentsTable } from "../documents.schema";
import { NewDocument, type Document } from "../documents.types";
import {
  executeSingle,
  type DbResult,
} from "@/lib/drizzle/results/results.single";

export async function createDocument(
  documentData: NewDocument,
): Promise<DbResult<Document>> {
  return executeSingle(
    db
      .insert(documentsTable)
      .values(documentData)
      .returning()
      .then(([document]) => document),
  );
}
