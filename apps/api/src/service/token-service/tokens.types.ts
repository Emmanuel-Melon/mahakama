// apps/api/src/workflows/tokens/tokens.types.ts
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import {
  secureTokenEventTypeEnum,
  secureTokensSchema,
  secureTokenTypeEnum,
} from "./tokens.schema";

extendZodWithOpenApi(z);

/*
 * DRIZZLE-GENERATED SCHEMAS
 */
export const secureTokenInsertSchema = createInsertSchema(
  secureTokensSchema,
).openapi({
  title: "CreateSecureTokenRequest",
  description: "Request schema for issuing a new secure link/token",
});

export const secureTokenSelectSchema = createSelectSchema(secureTokensSchema)
  .omit({ tokenHash: true })
  .openapi({
    title: "SecureToken",
    description: "Secure link response schema (excludes the token hash)",
  });

/*
 * DOMAIN-SPECIFIC TYPES
 */
export type SecureToken = z.infer<typeof secureTokenSelectSchema>;
export type NewSecureToken = z.infer<typeof secureTokenInsertSchema>;
export type SecureTokenType = (typeof secureTokenTypeEnum.enumValues)[number];
export type SecureTokenEventType =
  (typeof secureTokenEventTypeEnum.enumValues)[number];

export interface GenerateLinkOptions {
  tokenType: SecureTokenType;
  userId?: string;
  entityType: string;
  entityId: string;
  expiresInMinutes: number;
  baseUrl: string;
  metadata?: Record<string, unknown>;
}

export interface RequestContext {
  ipAddress?: string;
  userAgent?: string;
}

// apps/api/src/workflows/tokens/tokens.types.ts

export type TokenType = "CODE" | "LINK";

export type RevokeScope = "user" | "entity" | "none";

export interface CodeFormatConfig {
  alphabet: string;
  length: number;
  groups: number;
  separator: string;
}

export interface TokenProfile {
  type: TokenType;
  entityType: string; // Domain discriminator (e.g. "user", "voucher", "invite")
  entityId: string; // Unique record identifier
  expiresInMinutes: number;
  maxUses?: number; // Undefined = domain-managed balance/state
  revokeScope?: RevokeScope; // Default: "entity"
  codeFormat?: CodeFormatConfig; // Required if type is "CODE"
  baseUrl?: string; // Required if type is "LINK"
}

export type IssueTokenResult = {
  tokenId: string;
  secret: string; // Raw value delivered once to the client/user
  payload:
    | { kind: "LINK"; url: string }
    | { kind: "CODE"; code: string; display: string };
};

export type TokenEventContext = {
  ipAddress?: string;
  userAgent?: string;
  userId?: string;
};
