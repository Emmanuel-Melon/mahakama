import { lawyersTable } from "../lawyers.schema";
import { eq } from "drizzle-orm";
import type { Lawyer, LawyerFilters } from "../lawyers.types";
import { toManyResult } from "@/lib/drizzle/drizzle.utils";
import { DbManyResult } from "@/lib/drizzle/drizzle.types";
import { paginate } from "@/lib/drizzle/drizzle.paginate";

export async function findApprovedLawyers(
  query: LawyerFilters,
): Promise<DbManyResult<Lawyer>> {
  const filters = [eq(lawyersTable.status, "approved")];

  if (query.specialization) {
    filters.push(eq(lawyersTable.specialization, query.specialization));
  }

  if (query.location) {
    filters.push(eq(lawyersTable.location, query.location));
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
