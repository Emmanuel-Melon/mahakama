import { db } from "@/lib/drizzle";
import { authEventsSchema } from "../auth.schema";
import { eq } from "drizzle-orm";
import { toSingleResult, toManyResult } from "@/lib/drizzle/drizzle.utils";
import { DbSingleResult, DbManyResult } from "@/lib/drizzle/drizzle.types";
import { AuthEvent, AuthColumn, AuthColumnKey, AuthUser } from "../auth.types";
import { usersSchema } from "@/feature/users/users.schema";

export const findAllAuthEvents = async (): Promise<DbManyResult<AuthEvent>> => {
  const result = await db.query.authEventsSchema.findMany();
  return toManyResult(result);
};

export const findAuthEventById = async (
  id: string,
): Promise<DbSingleResult<AuthEvent>> => {
  const result = await db.query.authEventsSchema.findFirst({
    where: eq(authEventsSchema.id, id),
  });
  return toSingleResult(result);
};

export const findAuthEventsByUserId = async (
  userId: string,
): Promise<DbManyResult<AuthEvent>> => {
  const result = await db.query.authEventsSchema.findMany({
    where: eq(authEventsSchema.userId, userId),
  });
  return toManyResult(result);
};

export const findAuthUser = async <K extends AuthColumnKey>(
  field: K,
  value: AuthColumn[K]["_"]["data"],
): Promise<DbSingleResult<AuthUser>> => {
  const result = await db.query.usersSchema.findFirst({
    where: eq(usersSchema[field], value),
  });
  return toSingleResult(result);
};
