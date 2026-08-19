// apps/api/src/workflows/tokens/operations/tokens.find.ts
import { and, eq, gt, isNull } from "drizzle-orm";

import { db } from "@/lib/drizzle";

import { secureTokensSchema } from "../tokens.schema";
import type { RequestContext, SecureTokenType } from "../tokens.types";
import { logSecureTokenEvent } from "./tokens.insert";
import { hashToken } from "../tokens.utils";

export const peekSecureToken = async (
  tokenType: SecureTokenType,
  rawToken: string,
  ctx: RequestContext = {},
) => {
  const tokenHash = hashToken(rawToken);

  const [row] = await db
    .select()
    .from(secureTokensSchema)
    .where(
      and(
        eq(secureTokensSchema.tokenHash, tokenHash),
        eq(secureTokensSchema.tokenType, tokenType),
      ),
    );

  if (!row) {
    await logSecureTokenEvent(null, "INVALID_ATTEMPT", ctx);
    return null;
  }
  if (row.revokedAt || row.usedAt) {
    await logSecureTokenEvent(row.id, "INVALID_ATTEMPT", ctx);
    return null;
  }
  if (row.expiresAt < new Date()) {
    await logSecureTokenEvent(row.id, "EXPIRED_ATTEMPT", ctx);
    return null;
  }

  await logSecureTokenEvent(row.id, "VIEWED", ctx);
  return row;
};

export const consumeSecureToken = async (
  tokenType: SecureTokenType,
  rawToken: string,
  ctx: RequestContext = {},
) => {
  const tokenHash = hashToken(rawToken);

  const [row] = await db
    .update(secureTokensSchema)
    .set({ usedAt: new Date() })
    .where(
      and(
        eq(secureTokensSchema.tokenHash, tokenHash),
        eq(secureTokensSchema.tokenType, tokenType),
        isNull(secureTokensSchema.usedAt),
        isNull(secureTokensSchema.revokedAt),
        gt(secureTokensSchema.expiresAt, new Date()),
      ),
    )
    .returning();

  if (row) {
    await logSecureTokenEvent(row.id, "CONSUMED", ctx);
  } else {
    await logSecureTokenEvent(null, "INVALID_ATTEMPT", ctx);
  }

  return row ?? null;
};
