import { db } from "@/lib/drizzle";
import { lawyersTable } from "../lawyers.schema";
import { eq } from "drizzle-orm";
import type { Lawyer, NewLawyer } from "../lawyers.types";
import { toResult } from "@/lib/drizzle/drizzle.utils";
import { DbResult } from "@/lib/drizzle/drizzle.types";

export async function updateLawyer(
  id: number,
  updateData: NewLawyer,
): Promise<DbResult<Lawyer>> {
  const [updatedLawyer] = await db
    .update(lawyersTable)
    .set({
      ...updateData,
      updatedAt: new Date(),
    })
    .where(eq(lawyersTable.id, id.toString()))
    .returning();

  return toResult(updatedLawyer);
}
