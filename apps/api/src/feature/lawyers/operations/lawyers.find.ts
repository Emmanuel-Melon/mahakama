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
  executeSingle,
  type DbResult,
} from "@/lib/drizzle/results/results.single";
import { toManyResult } from "@/lib/drizzle/drizzle.utils";
import { DbManyResult } from "@/lib/drizzle/drizzle.types";
import { paginate } from "@/lib/drizzle/drizzle.paginate";

export const findLawyer = async <K extends LawyerColumnKey>(
  field: K,
  value: LawyerColumn[K]["_"]["data"],
): Promise<DbResult<Lawyer>> => {
  return executeSingle(
    db.query.lawyers.findFirst({
      where: eq(lawyersTable[field], value),
    }),
  );
};

export async function findLawyers(
  query: LawyerFilters,
): Promise<DbManyResult<Lawyer>> {
  const filters = [];

  if (query.specialization) {
    filters.push(eq(lawyersTable.specialization, query.specialization));
  }

  if (query.status) {
    filters.push(
      eq(
        lawyersTable.status,
        query.status as "draft" | "submitted" | "approved" | "rejected",
      ),
    );
  }

  if (query.userId) {
    filters.push(eq(lawyersTable.userId, query.userId));
  }

  const result = await paginate<"lawyers", Lawyer>("lawyers", lawyersTable, {
    ...query,
    filters,
    search: {
      q: query.q,
      columns: [lawyersTable.specialization, lawyersTable.location],
    },
  });

  return toManyResult(result);
}
