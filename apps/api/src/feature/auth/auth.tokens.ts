import jwt from "jsonwebtoken";
import { jwtVerify } from "jose";

import { createHash } from "crypto";

import { type Request as ExpressRequest } from "express";
import { AUTH_COOKIES } from "@/feature/auth/auth.config";
import {
  AccessPayload,
  RefreshPayload,
  TokenGenerationArgs,
} from "@/feature/auth/auth.types";
import { authConfig } from "@/config";
import { getCookieAudience } from "./auth.cookies";

export const generateAccessToken = ({
  userId,
  sessionId,
  role,
}: TokenGenerationArgs) => {
  const payload: Partial<AccessPayload> = {
    sub: userId,
    sid: sessionId,
    type: authConfig.tokens.access,
    role,
  };

  return jwt.sign(payload, authConfig.secrets.jwtSecret, {
    expiresIn: authConfig.timing.accessExpiration / 1000,
    audience: getCookieAudience(role),
    issuer: authConfig.issuer,
  });
};

export const generateRefreshToken = ({
  userId,
  sessionId,
  role,
}: TokenGenerationArgs) => {
  const payload: Partial<RefreshPayload> = {
    sub: userId,
    sid: sessionId,
    type: authConfig.tokens.refresh,
  };

  return jwt.sign(payload, authConfig.secrets.jwtRefreshSecret, {
    expiresIn: authConfig.timing.refreshExpiration / 1000,
    audience: getCookieAudience(role),
    issuer: authConfig.issuer,
  });
};

export const getAccessToken = (req: ExpressRequest): string | undefined => {
  for (const cookieName of Object.values(AUTH_COOKIES)) {
    if (req.cookies?.[cookieName]) {
      return req.cookies[cookieName];
    }
  }

  const authHeader = req.headers["authorization"];
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.split(" ")[1];
  }

  return undefined;
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, authConfig.secrets.jwtSecret) as AccessPayload;
};

export const verifyRefreshToken = (token: string, jwtRefreshSecret: string) => {
  return jwt.verify(token, jwtRefreshSecret) as unknown as RefreshPayload;
};

export async function decodeJWT(token: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(token, authConfig.secrets.joseSecret);
    return payload;
  } catch (error) {
    console.error("Failed to decode JWT:", error);
    return null;
  }
}

export const hashToken = (token: string): string => {
  return createHash("sha256").update(token).digest("hex");
};
