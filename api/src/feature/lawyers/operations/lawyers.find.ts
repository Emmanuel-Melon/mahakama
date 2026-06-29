import { db } from "@/lib/drizzle";
import { lawyersTable } from "../lawyers.schema";
import { eq } from "drizzle-orm";
import type { Lawyer, LawyerFilters } from "../lawyers.types";
import { toManyResult, toResult } from "@/lib/drizzle/drizzle.utils";
import { DbManyResult, DbResult } from "@/lib/drizzle/drizzle.types";
import { paginate } from "@/lib/drizzle/drizzle.paginate";

export async function findLawyerById(id: string): Promise<DbResult<Lawyer>> {
  const lawyer = await db.query.lawyers.findFirst({
    where: eq(lawyersTable.id, id),
  });
  return toResult(lawyer);
}

export async function findLawyerByEmail(
  email: string,
): Promise<DbResult<Lawyer>> {
  const lawyer = await db.query.lawyers.findFirst({
    where: eq(lawyersTable.email, email),
  });
  return toResult(lawyer);
}

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
