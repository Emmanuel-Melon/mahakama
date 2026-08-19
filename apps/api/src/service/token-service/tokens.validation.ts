// apps/api/src/workflows/tokens/tokens.validate.ts
import { and, eq, gt, isNull, sql } from "drizzle-orm";

import { db } from "@/lib/drizzle";

import { secureTokenEventsSchema, secureTokensSchema } from "./tokens.schema";
import { TokenEventContext, TokenType } from "./tokens.types";
import { hashCodeToken, hashToken } from "./tokens.utils";

export type ValidateResult =
  | {
      success: true;
      tokenId: string;
      entityType: string;
      entityId: string;
      userId?: string | null;
      metadata?: Record<string, unknown> | null;
    }
  | {
      success: false;
      reason: "NOT_FOUND" | "REVOKED" | "EXPIRED" | "MAX_USES_REACHED";
    };

/**
 * Validates a token secret (link or code) without consuming it.
 * Logs VALIDATED, EXPIRED_ATTEMPT, or INVALID_ATTEMPT events accordingly.
 */
export async function validateToken(
  rawSecret: string,
  type: TokenType,
  ctx?: TokenEventContext,
  pepper?: string,
): Promise<ValidateResult> {
  let tokenHash: string;

  if (type === "CODE") {
    if (!pepper)
      throw new Error(
        "SECURE_TOKEN_PEPPER is required to validate CODE tokens",
      );
    tokenHash = hashCodeToken(rawSecret, pepper);
  } else {
    tokenHash = hashToken(rawSecret);
  }

  const [token] = await db
    .select()
    .from(secureTokensSchema)
    .where(eq(secureTokensSchema.tokenHash, tokenHash))
    .limit(1);

  const now = new Date();

  // 1. Not Found / Invalid Attempt
  if (!token) {
    // If we have a tokenId to log against we can't, because it doesn't exist.
    // However, IP-level tracking handles broader abuse limits.
    return { success: false, reason: "NOT_FOUND" };
  }

  // Helper to record events
  async function logEvent(
    eventType: "VALIDATED" | "EXPIRED_ATTEMPT" | "INVALID_ATTEMPT",
  ) {
    await db.insert(secureTokenEventsSchema).values({
      tokenId: token.id,
      eventType,
      ipAddress: ctx?.ipAddress ?? null,
      userAgent: ctx?.userAgent ?? null,
    });
  }

  // 2. Revoked Check
  if (token.revokedAt) {
    await logEvent("INVALID_ATTEMPT");
    return { success: false, reason: "REVOKED" };
  }

  // 3. Expiration Check
  if (token.expiresAt < now) {
    await logEvent("EXPIRED_ATTEMPT");
    return { success: false, reason: "EXPIRED" };
  }

  // 4. Max Uses Check (if multi-use is bounded)
  if (token.maxUses !== null && token.usesCount >= token.maxUses) {
    await logEvent("EXPIRED_ATTEMPT"); // or max uses reached
    return { success: false, reason: "MAX_USES_REACHED" };
  }

  // Successfully validated
  await logEvent("VALIDATED");

  return {
    success: true,
    tokenId: token.id,
    entityType: token.entityType,
    entityId: token.entityId,
    userId: token.userId,
    metadata: token.metadata,
  };
}

/**
 * Consumes a token (increments use count, sets usedAt if single-use or terminal).
 */
export async function consumeToken(
  tokenId: string,
  ctx?: TokenEventContext,
): Promise<boolean> {
  const now = new Date();

  // Atomically increment usesCount and conditionally set usedAt when a bounded
  // maxUses is reached. Domain-managed tokens (maxUses IS NULL) are never marked used.
  const [updated] = await db
    .update(secureTokensSchema)
    .set({
      usesCount: sql`${secureTokensSchema.usesCount} + 1`,
      usedAt: sql`CASE WHEN ${secureTokensSchema.maxUses} IS NOT NULL AND ${secureTokensSchema.usesCount} + 1 >= ${secureTokensSchema.maxUses} THEN ${now} ELSE ${secureTokensSchema.usedAt} END`,
    })
    .where(
      and(
        eq(secureTokensSchema.id, tokenId),
        isNull(secureTokensSchema.revokedAt),
        gt(secureTokensSchema.expiresAt, now),
      ),
    )
    .returning({ id: secureTokensSchema.id });

  if (!updated) {
    return false;
  }

  // Log CONSUMED event
  await db.insert(secureTokenEventsSchema).values({
    tokenId,
    eventType: "CONSUMED",
    ipAddress: ctx?.ipAddress ?? null,
    userAgent: ctx?.userAgent ?? null,
  });

  return true;
}
