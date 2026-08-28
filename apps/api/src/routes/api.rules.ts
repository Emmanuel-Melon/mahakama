import { NextFunction, Request, Response, Router } from "express";

import { logger } from "@/lib/logger";
import type {
  ApiManifest,
  RateLimitRule,
  SecurityRule,
} from "@/routes/api.types";
import { MS_MULTIPLIERS } from "@/utils/dates";
import { authenticateToken, requireRole } from "@/middleware/auth";
import { createLimiter } from "@/middleware/rate-limiter";

export const logRequestState = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  logger.info(
    {
      path: req.path,
      method: req.method,
      user: req.user ? { id: req.user.id, role: req.user.role } : "anonymous",
    },
    "Request processing path",
  );
  next();
};

export function useApiRouters(router: Router, manifests: ApiManifest[]) {
  manifests.forEach((api) => {
    const isPrivate = api.isPrivate ?? true;
    const apiRouter = Router();

    if (isPrivate) {
      apiRouter.use(authenticateToken);
    }

    apiRouter.use(api.router);

    router.use(api.path, apiRouter);
  });
}

export function useAuthentication(router: Router, paths: string[]) {
  paths.forEach((path) => {
    router.all(path, authenticateToken);
  });
}

export function useAuthorization(router: Router, rules: SecurityRule[]) {
  rules.forEach((rule) => {
    if (rule.roles) {
      router.all(rule.path, requireRole(rule.roles));
    }
  });
}

export function useRateLimit(router: Router, rules: RateLimitRule[]) {
  rules.forEach((rule) => {
    const windowMs = rule.amount * MS_MULTIPLIERS[rule.unit];
    const limiter = createLimiter({ windowMs, limit: rule.limit });
    router.use(rule.path, limiter);
  });
}
