import { eq } from "drizzle-orm";

import { usersSchema } from "@/feature/users/users.schema";
import { type User } from "@/feature/users/users.types";
import { db } from "@/lib/drizzle";
import type { DbResult } from "@/lib/drizzle/drizzle.types";
import { executeSingle } from "@/lib/drizzle/results/results.single";
import { sessionsSchema } from "../auth.schema";
import type {
  Session,
  SessionColumn,
  SessionColumnKey,
  UpdateSession,
} from "../auth.types";
import { hashPassword } from "../auth.utils";

export async function updateUserPassword(
  userId: string,
  password: string,
): Promise<DbResult<User>> {
  const hashedPassword = await hashPassword(password);

  return executeSingle(
    db
      .update(usersSchema)
      .set({
        password: hashedPassword,
        updatedAt: new Date(),
      })
      .where(eq(usersSchema.id, userId))
      .returning()
      .then((result) => result[0]),
  );
}

export const updateAuthSession = async <K extends SessionColumnKey>(
  field: K,
  value: SessionColumn[K]["_"]["data"],
  data: UpdateSession,
): Promise<DbResult<Session>> => {
  return executeSingle(
    db
      .update(sessionsSchema)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(sessionsSchema[field], value))
      .returning()
      .then(([updatedSession]) => updatedSession),
  );
};

export const revokeSession = async (
  sessionId: string,
): Promise<DbResult<Session>> => {
  return updateAuthSession("id", sessionId, { isRevoked: true });
};
