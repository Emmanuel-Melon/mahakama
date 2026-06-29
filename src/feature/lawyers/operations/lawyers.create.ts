import { db } from "@/lib/drizzle";
import { lawyersTable } from "../lawyers.schema";
import type { Lawyer, NewLawyer } from "../lawyers.types";
import { toResult } from "@/lib/drizzle/drizzle.utils";
import { DbResult } from "@/lib/drizzle/drizzle.types";

export async function createLawyer(
  lawyerData: NewLawyer,
): Promise<DbResult<Lawyer>> {
  const insertData = {
    ...lawyerData,
    casesHandled: lawyerData.casesHandled ?? 0,
    isAvailable: lawyerData.isAvailable ?? true,
    rating: lawyerData.rating ?? "0",
  };
  const [newLawyer] = await db
    .insert(lawyersTable)
    .values(insertData)
    .returning();
  return toResult(newLawyer);
}
