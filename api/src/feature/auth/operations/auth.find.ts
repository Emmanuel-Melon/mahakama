import { db } from "@/lib/drizzle";
import { authEventsSchema } from "../auth.schema";
import { eq } from "drizzle-orm";
import { toSingleResult, toManyResult } from "@/lib/drizzle/drizzle.utils";
import { DbSingleResult, DbManyResult } from "@/lib/drizzle/drizzle.types";
import {
  AuthEvent,
  AuthEventColumn,
  AuthEventColumnKey,
  AuthEventFilters,
  AuthColumn,
  AuthColumnKey,
  AuthUser,
} from "../auth.types";
import { usersSchema } from "@/feature/users/users.schema";
import { paginate } from "@/lib/drizzle/drizzle.paginate";

export const findAuthEvent = async <K extends AuthEventColumnKey>(
  field: K,
  value: AuthEventColumn[K]["_"]["data"],
): Promise<DbSingleResult<AuthEvent>> => {
  const result = await db.query.authEventsSchema.findFirst({
    where: eq(authEventsSchema[field], value),
  });
  return toSingleResult(result);
};

export async function findAuthEvents(
  query: AuthEventFilters,
): Promise<DbManyResult<AuthEvent>> {
  const filters = [];

  if (query.eventType) {
    filters.push(eq(authEventsSchema.eventType, query.eventType));
  }

  if (query.userId) {
    filters.push(eq(authEventsSchema.userId, query.userId));
  }

  const result = await paginate<"authEventsSchema", AuthEvent>(
    "authEventsSchema",
    authEventsSchema,
    {
      ...query,
      filters,
      search: {
        q: query.q,
        columns: [authEventsSchema.eventType],
      },
    },
  );

  return toManyResult(result);
}

export const findAuthUser = async <K extends AuthColumnKey>(
  field: K,
  value: AuthColumn[K]["_"]["data"],
): Promise<DbSingleResult<AuthUser>> => {
  const result = await db.query.usersSchema.findFirst({
    where: eq(usersSchema[field], value),
  });
  return toSingleResult(result);
};
