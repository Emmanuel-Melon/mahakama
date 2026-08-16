import { db } from "@/lib/drizzle";
import { User, UserColumn, UserColumnKey, UserFilters } from "../users.types";
import { usersSchema } from "../users.schema";
import { eq } from "drizzle-orm";
import { toSingleResult, toManyResult } from "@/lib/drizzle/drizzle.utils";
import { DbSingleResult, DbManyResult } from "@/lib/drizzle/drizzle.types";
import { paginate } from "@/lib/drizzle/drizzle.paginate";

export const findUser = async <K extends UserColumnKey>(
  field: K,
  value: UserColumn[K]["_"]["data"],
): Promise<DbSingleResult<User>> => {
  const result = await db.query.usersSchema.findFirst({
    where: eq(usersSchema[field], value),
  });
  return toSingleResult(result);
};

export async function findUsers(
  query: UserFilters,
): Promise<DbManyResult<User>> {
  const filters = [];

  if (query.role) {
    filters.push(eq(usersSchema.role, query.role));
  }

  const result = await paginate<"usersSchema", User>(
    "usersSchema",
    usersSchema,
    {
      ...query,
      filters,
      search: {
        q: query.q,
        columns: [usersSchema.name, usersSchema.email],
      },
    },
  );

  return toManyResult(result);
}
