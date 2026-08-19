// apps/api/src/workflows/tokens/operations/tokens.insert.ts
import { randomBytes } from "crypto";
import { and, eq, isNull } from "drizzle-orm";

import { db } from "@/lib/drizzle";

import { secureTokenEventsSchema, secureTokensSchema } from "../tokens.schema";
import {
  IssueTokenResult,
  TokenProfile,
  type GenerateLinkOptions,
  type RequestContext,
  type SecureTokenEventType,
} from "../tokens.types";
import { generateHumanCode, hashCodeToken, hashToken } from "../tokens.utils";
import { revokeTokens } from "./tokens.update";
import { addTimeToNow } from "@/utils/dates";
import { generateOpaqueToken } from "../tokens.generator";

export async function issueToken(
  profile: TokenProfile,
  actorCtx?: { ipAddress?: string; userAgent?: string; userId?: string },
): Promise<IssueTokenResult> {
  const {
    type,
    entityType,
    entityId,
    expiresInMinutes,
    maxUses,
    revokeScope = "entity",
    codeFormat,
    baseUrl,
  } = profile;

  // 1. Handle auto-revocation if requested
  if (revokeScope !== "none") {
    if (revokeScope === "entity") {
      await revokeTokens({ by: "entity", entityType, entityId }, actorCtx);
    } else if (revokeScope === "user" && actorCtx?.userId) {
      await revokeTokens(
        { by: "userAndType", userId: actorCtx.userId, tokenType: type },
        actorCtx,
      );
    }
  }

  const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000);
  let tokenHash = "";
  let secret = "";
  let payload: IssueTokenResult["payload"];

  if (type === "CODE") {
    if (!codeFormat) throw new Error("codeFormat is required for CODE tokens");
    const pepper = process.env.SECURE_TOKEN_PEPPER;
    if (!pepper)
      throw new Error("SECURE_TOKEN_PEPPER environment variable is missing");

    const generated = generateHumanCode(codeFormat);
    secret = generated.display; // Return formatted string for delivery
    tokenHash = hashCodeToken(generated.code, pepper);
    payload = {
      kind: "CODE",
      code: generated.code,
      display: generated.display,
    };
  } else {
    // LINK token
    if (!baseUrl) throw new Error("baseUrl is required for LINK tokens");
    secret = randomBytes(32).toString("hex");
    tokenHash = hashToken(secret);
    payload = {
      kind: "LINK",
      url: `${baseUrl}?token=${secret}`,
    };
  }

  // 2. Insert the token into database
  const [inserted] = await db
    .insert(secureTokensSchema)
    .values({
      tokenHash,
      tokenType: type,
      userId: actorCtx?.userId,
      entityType,
      entityId,
      maxUses: maxUses ?? null,
      usesCount: 0,
      expiresAt,
    })
    .returning({ id: secureTokensSchema.id });

  return {
    tokenId: inserted.id,
    secret,
    payload,
  };
}

export const generateSecureToken = async ({
  tokenType,
  userId,
  entityType,
  entityId,
  expiresInMinutes,
  baseUrl,
  metadata,
}: GenerateLinkOptions) => {
  const { rawToken, tokenHash } = generateOpaqueToken();
  const expiresAt = addTimeToNow(expiresInMinutes, "minutes");

  await db.transaction(async (tx) => {
    if (userId) {
      await tx
        .update(secureTokensSchema)
        .set({ revokedAt: new Date() })
        .where(
          and(
            eq(secureTokensSchema.userId, userId),
            eq(secureTokensSchema.tokenType, tokenType),
            isNull(secureTokensSchema.usedAt),
            isNull(secureTokensSchema.revokedAt),
          ),
        );
    }

    await tx.insert(secureTokensSchema).values({
      userId,
      tokenType,
      entityType,
      entityId,
      tokenHash,
      expiresAt,
      metadata,
    });
  });

  return `${baseUrl}?token=${rawToken}`;
};

export const logSecureTokenEvent = async (
  tokenId: string | null,
  eventType: SecureTokenEventType,
  ctx: RequestContext = {},
) => {
  await db.insert(secureTokenEventsSchema).values({
    tokenId,
    eventType,
    ipAddress: ctx.ipAddress,
    userAgent: ctx.userAgent,
  });
};
