import { db } from "@/lib/drizzle";
import { lawyersTable } from "../lawyers.schema";
import type { Lawyer, NewLawyer } from "../lawyers.types";
import {
  executeSingle,
  type DbResult,
} from "@/lib/drizzle/results/results.single";

export async function createLawyer(
  lawyerData: NewLawyer,
): Promise<DbResult<Lawyer>> {
  const insertData = {
    ...lawyerData,
    casesHandled: lawyerData.casesHandled ?? 0,
    isAvailable: lawyerData.isAvailable ?? true,
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
