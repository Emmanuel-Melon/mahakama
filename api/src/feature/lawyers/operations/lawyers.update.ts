import { db } from "@/lib/drizzle";
import { lawyersTable } from "../lawyers.schema";
import { eq } from "drizzle-orm";
import type {
  Lawyer,
  LawyerColumn,
  LawyerColumnKey,
  UpdateLawyer,
} from "../lawyers.types";
import {
  executeSingle,
  type DbResult,
} from "@/lib/drizzle/results/results.single";

export const updateLawyer = async <K extends LawyerColumnKey>(
  field: K,
  value: LawyerColumn[K]["_"]["data"],
  updateData: UpdateLawyer,
): Promise<DbResult<Lawyer>> => {
  return executeSingle(
    db
      .update(lawyersTable)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(lawyersTable[field], value))
      .returning()
      .then(([result]) => result),
  );
};
