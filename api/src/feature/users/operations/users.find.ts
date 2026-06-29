import { db } from "@/lib/drizzle";
import { User, UserFilters } from "../users.types";
import { usersSchema } from "../users.schema";
import { eq } from "drizzle-orm";
import { toSingleResult, toManyResult } from "@/lib/drizzle/drizzle.utils";
import { DbSingleResult, DbManyResult } from "@/lib/drizzle/drizzle.types";
import { paginate } from "@/lib/drizzle/drizzle.paginate";

export const findUserById = async (
  id: string,
): Promise<DbSingleResult<User>> => {
  const result = await db.query.usersSchema.findFirst({
    where: eq(usersSchema.id, id),
  });
  return toSingleResult(result);
};

export const findUserByEmail = async (
  email: string,
): Promise<DbSingleResult<User>> => {
  const [user] = await db
    .select()
    .from(usersSchema)
    .where(eq(usersSchema.email, email))
    .limit(1);
  return toSingleResult(user);
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
