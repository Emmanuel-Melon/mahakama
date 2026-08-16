import { db } from "@/lib/drizzle";
import { lawyersTable } from "../lawyers.schema";
import { eq } from "drizzle-orm";
import type {
  Lawyer,
  LawyerColumn,
  LawyerColumnKey,
  LawyerFilters,
} from "../lawyers.types";
import {
  toManyResult,
  toResult,
  toSingleResult,
} from "@/lib/drizzle/drizzle.utils";
import { DbManyResult, DbResult } from "@/lib/drizzle/drizzle.types";
import { paginate } from "@/lib/drizzle/drizzle.paginate";

export const findLawyer = async <K extends LawyerColumnKey>(
  field: K,
  value: LawyerColumn[K]["_"]["data"],
): Promise<DbResult<Lawyer>> => {
  const lawyer = await db.query.lawyers.findFirst({
    where: eq(lawyersTable[field], value),
  });
  return toSingleResult(lawyer);
};

export async function findLawyers(
  query: LawyerFilters,
): Promise<DbManyResult<Lawyer>> {
  const filters = [];

  if (query.specialization) {
    filters.push(eq(lawyersTable.specialization, query.specialization));
  }

  const result = await paginate<"lawyers", Lawyer>("lawyers", lawyersTable, {
    ...query,
    filters,
    search: {
      q: query.q,
      columns: [lawyersTable.name, lawyersTable.location],
    },
  });

  return toManyResult(result);
}
