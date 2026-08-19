import { and, count, eq, gte, sql } from "drizzle-orm";

import { db } from "@/lib/drizzle";
import type { DbResult } from "@/lib/drizzle/drizzle.types";
import { executeSingle } from "@/lib/drizzle/results/results.single";

import { authEventsSchema, sessionsSchema } from "../auth.schema";
import type {
  AuthEvent,
  InsertAuthEventInput,
  InsertSessionInput,
  Session,
} from "../auth.types";
import { hashToken } from "../auth.tokens";

export async function insertAuthEvent(
  data: InsertAuthEventInput,
): Promise<DbResult<AuthEvent>> {
  return executeSingle(
    db
      .insert(authEventsSchema)
      .values({
        userId: data.userId,
        eventType: data.eventType,
        createdAt: data.createdAt,
      })
      .returning()
      .then((result) => result[0]),
  );
}

export const insertSession = async ({
  sessionId,
  userId,
  refreshToken,
}: InsertSessionInput): Promise<DbResult<Session>> => {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  return executeSingle(
    db
      .insert(sessionsSchema)
      .values({
        userId,
        expiresAt,
        id: sessionId,
        refreshTokenHash: hashToken(refreshToken),
      })
      .returning()
      .then((result) => result[0]),
  );
};

export const recordAttemptAndCheckLimit = async (
  userId: string,
  eventType: string,
  windowMinutes = 60,
  maxAttempts = 3,
): Promise<boolean> => {
  return db.transaction(async (tx) => {
    const lockKey = `${userId}:${eventType}`;

    await tx.execute(sql`SELECT pg_advisory_xact_lock(hashtext(${lockKey}))`);

    await tx
      .insert(authEventsSchema)
      .values({ userId, eventType, createdAt: new Date() });

    const windowStart = new Date(Date.now() - windowMinutes * 60 * 1000);
    const [result] = await tx
      .select({ total: count() })
      .from(authEventsSchema)
      .where(
        and(
          eq(authEventsSchema.userId, userId),
          eq(authEventsSchema.eventType, eventType),
          gte(authEventsSchema.createdAt, windowStart),
        ),
      );

    return (result?.total ?? 0) > maxAttempts;
  });
};
