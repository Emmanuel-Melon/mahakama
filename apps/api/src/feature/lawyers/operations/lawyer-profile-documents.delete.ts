import { db } from "@/lib/drizzle";
import { lawyerProfileDocumentsTable } from "../lawyers.schema";
import { eq } from "drizzle-orm";
import {
  executeSingle,
  type DbResult,
} from "@/lib/drizzle/results/results.single";

export async function deleteLawyerProfileDocument(
  id: string,
): Promise<DbResult<{ id: string }>> {
  return executeSingle(
    db
      .delete(lawyerProfileDocumentsTable)
      .where(eq(lawyerProfileDocumentsTable.id, id))
      .returning({ id: lawyerProfileDocumentsTable.id })
      .then(([result]) => result),
  );
}
