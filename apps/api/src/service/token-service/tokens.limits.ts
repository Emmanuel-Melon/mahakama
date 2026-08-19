import { and, count, eq, gte, inArray } from "drizzle-orm";

import { db } from "@/lib/drizzle";

import { secureTokenEventsSchema } from "./tokens.schema";

export const isIpRateLimited = async (
  ipAddress: string,
  windowMinutes = 15,
  maxAttempts = 10,
): Promise<boolean> => {
  const windowStart = new Date(Date.now() - windowMinutes * 60 * 1000);
  const [result] = await db
    .select({ total: count() })
    .from(secureTokenEventsSchema)
    .where(
      and(
        eq(secureTokenEventsSchema.ipAddress, ipAddress),
        gte(secureTokenEventsSchema.createdAt, windowStart),
        inArray(secureTokenEventsSchema.eventType, [
          "INVALID_ATTEMPT",
          "EXPIRED_ATTEMPT",
        ]),
      ),
    );
  return (result?.total ?? 0) >= maxAttempts;
};
