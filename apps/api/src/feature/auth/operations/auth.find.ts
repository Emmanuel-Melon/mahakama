import { and, eq } from "drizzle-orm";

import { usersSchema } from "@/feature/users/users.schema";
import type { AuthUser } from "../auth.types";
import { db } from "@/lib/drizzle";
import type { DbResult } from "@/lib/drizzle/drizzle.types";
import { executeSingle } from "@/lib/drizzle/results/results.single";

import { sessionsSchema } from "../auth.schema";
import type {
  AuthColumn,
  AuthColumnKey,
  Session,
  SessionColumn,
  SessionColumnKey,
} from "../auth.types";

export const findAuthSession = <K extends SessionColumnKey>(
  field: K,
  value: SessionColumn[K]["_"]["data"],
): Promise<DbResult<Session>> =>
  executeSingle(
    db.query.sessionsSchema.findFirst({
      where: eq(sessionsSchema[field], value),
    }),
  );

export const findActiveSession = <K extends SessionColumnKey>(
  field: K,
  value: SessionColumn[K]["_"]["data"],
): Promise<DbResult<Session>> =>
  executeSingle(
    db.query.sessionsSchema.findFirst({
      where: and(
        eq(sessionsSchema[field], value),
        eq(sessionsSchema.isRevoked, false),
      ),
    }),
  );

export const findAuthUser = <K extends AuthColumnKey>(
  field: K,
  value: AuthColumn[K]["_"]["data"],
): Promise<DbResult<AuthUser>> =>
  executeSingle(
    db.query.usersSchema.findFirst({
      where: eq(usersSchema[field], value),
    }),
  );
