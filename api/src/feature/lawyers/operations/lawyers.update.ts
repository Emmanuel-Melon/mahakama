import { db } from "@/lib/drizzle";
import { lawyersTable } from "../lawyers.schema";
import { eq } from "drizzle-orm";
import type {
  Lawyer,
  LawyerColumn,
  LawyerColumnKey,
  NewLawyer,
  UpdateLawyer,
} from "../lawyers.types";
import { toResult, toSingleResult } from "@/lib/drizzle/drizzle.utils";
import { DbResult } from "@/lib/drizzle/drizzle.types";

export const updateLawyer = async <K extends LawyerColumnKey>(
  field: K,
  value: LawyerColumn[K]["_"]["data"],
  updateData: UpdateLawyer,
): Promise<DbResult<Lawyer>> => {
  const updatedLawyer = await db
    .update(lawyersTable)
    .set({
      ...updateData,
      updatedAt: new Date(),
    })
    .where(eq(lawyersTable[field], value))
    .returning()
    .then(([result]) => result);

  return toSingleResult(updatedLawyer);
};
