import { db } from "@/lib/drizzle";
import { User, UserColumn, UserColumnKey, UserFilters } from "../users.types";
import { usersSchema } from "../users.schema";
import { eq } from "drizzle-orm";
import { toManyResult } from "@/lib/drizzle/drizzle.utils";
import { DbManyResult } from "@/lib/drizzle/drizzle.types";
import { paginate } from "@/lib/drizzle/drizzle.paginate";
import {
  executeSingle,
  type DbResult,
} from "@/lib/drizzle/results/results.single";

export const findUser = <K extends UserColumnKey>(
  field: K,
  value: UserColumn[K]["_"]["data"],
): Promise<DbResult<User>> =>
  executeSingle(
    db.query.usersSchema.findFirst({
      where: eq(usersSchema[field], value),
      columns: { password: false },
    }),
  );

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
