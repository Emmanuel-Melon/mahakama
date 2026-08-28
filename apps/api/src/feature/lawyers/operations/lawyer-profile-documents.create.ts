import { db } from "@/lib/drizzle";
import { lawyerProfileDocumentsTable } from "../lawyers.schema";
import type {
  LawyerProfileDocument,
  NewLawyerProfileDocument,
} from "../lawyers.types";
import {
  executeSingle,
  type DbResult,
} from "@/lib/drizzle/results/results.single";

export async function createLawyerProfileDocument(
  docData: NewLawyerProfileDocument,
): Promise<DbResult<LawyerProfileDocument>> {
  return executeSingle(
    db
      .insert(lawyerProfileDocumentsTable)
      .values(docData)
      .returning()
      .then(([newDoc]) => newDoc),
  );
}
