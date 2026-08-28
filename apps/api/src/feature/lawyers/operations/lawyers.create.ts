import { db } from "@/lib/drizzle";
import { lawyersTable } from "../lawyers.schema";
import type { Lawyer, NewLawyer } from "../lawyers.types";
import { eq } from "drizzle-orm";
import {
  executeSingle,
  type DbResult,
} from "@/lib/drizzle/results/results.single";

export async function createLawyer(
  lawyerData: NewLawyer,
): Promise<DbResult<Lawyer>> {
  const existing = await db.query.lawyers.findFirst({
    where: eq(lawyersTable.userId, lawyerData.userId),
    columns: { id: true },
  });

  if (existing) {
    return {
      ok: false,
      data: null,
      reason: "A lawyer profile already exists for this user",
      type: "CONFLICT",
    };
  }

  const insertData = {
    ...lawyerData,
    status: lawyerData.status ?? "draft",
    casesHandled: lawyerData.casesHandled ?? 0,
    isAvailable: lawyerData.isAvailable ?? false,
    rating: lawyerData.rating ?? "0",
  };

  return executeSingle(
    db
      .insert(lawyersTable)
      .values(insertData)
      .returning()
      .then(([newLawyer]) => newLawyer),
  );
}
