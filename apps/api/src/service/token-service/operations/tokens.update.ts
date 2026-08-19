// apps/api/src/workflows/tokens/tokens.revoke.ts
import { and, eq, isNull } from "drizzle-orm";

import { db } from "@/lib/drizzle";

import { secureTokenEventsSchema, secureTokensSchema } from "../tokens.schema";
import { TokenType } from "../tokens.types";

export type RevokeQuery =
  | { by: "id"; tokenId: string }
  | { by: "entity"; entityType: string; entityId: string }
  | { by: "userAndType"; userId: string; tokenType: TokenType };

export async function revokeTokens(
  query: RevokeQuery,
  ctx?: { ipAddress?: string; userAgent?: string },
): Promise<number> {
  const now = new Date();
  let condition;

  if (query.by === "id") {
    condition = eq(secureTokensSchema.id, query.tokenId);
  } else if (query.by === "entity") {
    condition = and(
      eq(secureTokensSchema.entityType, query.entityType),
      eq(secureTokensSchema.entityId, query.entityId),
    );
  } else {
    condition = and(
      eq(secureTokensSchema.userId, query.userId),
      eq(secureTokensSchema.tokenType, query.tokenType),
    );
  }

  // Atomic soft-revoke: only update rows that aren't already used or revoked
  const revokedRows = await db
    .update(secureTokensSchema)
    .set({ revokedAt: now })
    .where(
      and(
        condition,
        isNull(secureTokensSchema.usedAt),
        isNull(secureTokensSchema.revokedAt),
      ),
    )
    .returning({ id: secureTokensSchema.id });

  // Log REVOKED event for each affected token
  if (revokedRows.length > 0) {
    const eventValues = revokedRows.map((row) => ({
      tokenId: row.id,
      eventType: "REVOKED" as const,
      ipAddress: ctx?.ipAddress ?? null,
      userAgent: ctx?.userAgent ?? null,
    }));

    await db.insert(secureTokenEventsSchema).values(eventValues);
  }

  return revokedRows.length;
}
