import { authConfig, cookieConfig, serverConfig } from "@/config";
import { Request, Response, type CookieOptions } from "express";
import { AuthTokensArgs, GetCookieOptionsArgs, UserRole } from "./auth.types";
import { AUTH_COOKIES } from "./auth.config";
import { logger } from "@/lib/logger";
import { TIME_IN_MS } from "./auth.config";

export const getCookieOptions = (
  req: Request,
  options: GetCookieOptionsArgs = {},
): CookieOptions => {
  const { isProduction } = serverConfig;
  const { cookieDomains, cookieSecure, cookieSameSite } = cookieConfig;
  const origin = req.headers.origin;

  const fallbackDomain =
    cookieDomains.find((d) => origin?.includes(d)) || cookieDomains[0];

  const { maxAgeInMs, domain, sameSite, ...restOptions } = options;

  const secureValue = cookieSecure !== undefined ? cookieSecure : isProduction;

  return {
    httpOnly: true,
    secure: secureValue,
    sameSite: sameSite || cookieSameSite || (isProduction ? "none" : "lax"),
    path: "/",
    domain: domain !== undefined ? domain : fallbackDomain,
    ...(maxAgeInMs && { maxAge: maxAgeInMs }),
    ...restOptions,
  };
};

export const clearAuthCookie = (
  res: Response,
  role: UserRole = "user",
): void => {
  const cookieName = AUTH_COOKIES[role] || "token";
  res.clearCookie(cookieName, {
    ...getCookieOptions({} as Request),
    maxAge: 0,
  });
};

export const getCookieAudience = (role: UserRole): string => {
  switch (role) {
    case "lawyer":
      return authConfig.audience.LAWYER;
    case "admin":
      return authConfig.audience.ADMIN;
    default:
      return authConfig.audience.USER;
  }
};

export const getCookieName = (role: UserRole): string => {
  return AUTH_COOKIES[role];
};

export const setAuthCookies = ({
  req,
  res,
  userId,
  role,
  accessToken,
  refreshToken,
}: AuthTokensArgs) => {
  const domain =
    cookieConfig.cookieDomains.find((d) => req.headers.origin?.includes(d)) ||
    cookieConfig.cookieDomains[0];

  logger.info(`Domain: ${domain}`);

  const accessCookieOptions = getCookieOptions(req, {
    maxAgeInMs: TIME_IN_MS.ONE_HOUR,
    domain,
  });

  const refreshCookieOptions = getCookieOptions(req, {
    maxAgeInMs: TIME_IN_MS.THIRTY_DAYS,
    path: "/api/v1/auth/refresh",
    domain,
  });

  logger.info(
    {
      userId,
      role,
      resolvedDomain: accessCookieOptions.domain,
      originHeader: req.headers.origin,
    },
    "Setting active auth cookies for session",
  );

  const cookieName = AUTH_COOKIES[role];
  res.cookie(cookieName, accessToken, accessCookieOptions);
  res.cookie("refreshToken", refreshToken, refreshCookieOptions);
};
