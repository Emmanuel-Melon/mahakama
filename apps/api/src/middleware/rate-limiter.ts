import { Options, rateLimit } from "express-rate-limit";

export const baseRateLimitConfig: Partial<Options> = {
  standardHeaders: "draft-8",
  legacyHeaders: false,
  ipv6Subnet: 56,
};

export const createLimiter = (overrides: Partial<Options>) =>
  rateLimit({ ...baseRateLimitConfig, ...overrides });

export const limiter = createLimiter({ windowMs: 15 * 60 * 1000, limit: 100 });