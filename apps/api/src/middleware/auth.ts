import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { serverConfig } from "@/config";
import { findUser } from "@/feature/users/operations/users.find";
import { getAccessToken } from "@/feature/auth/auth.tokens";
import { logger } from "@/lib/logger";
import { sendErrorResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/lib/http/http.status";
import { UserRole } from "@/feature/auth/auth.types";

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers["authorization"];
  const cookieNames = Object.keys(req.cookies ?? {});
  const token = getAccessToken(req);
  logger.info(
    {
      path: req.path,
      method: req.method,
      hasAuthHeader: !!authHeader,
      authHeaderPrefix: authHeader ? authHeader.slice(0, 7) : null,
      cookieNames,
      tokenResolved: !!token,
    },
    "Auth attempt: checking credentials",
  );
  if (!token) {
    sendErrorResponse(req, res, {
      status: HttpStatus.UNAUTHORIZED,
      description: "Authentication Error",
    });
    return;
  }
  try {
    const verified = jwt.verify(token!, serverConfig.jwtSecret!) as JwtPayload;
    if (!verified.sub) {
      logger.warn(
        { path: req.path },
        "Auth failed: token payload missing 'sub'",
      );
      sendErrorResponse(req, res, {
        status: HttpStatus.UNAUTHORIZED,
        description: "Authentication Error",
      });
      return;
    }
    const user = await findUser("id", verified.sub);
    if (!user.ok || !user.data) {
      logger.warn(
        {
          path: req.path,
          userId: verified.sub,
        },
        "Auth success but user not found for valid token",
      );
      sendErrorResponse(req, res, {
        status: HttpStatus.NOT_FOUND,
        description: "User not found for valid token",
      });
      return;
    }
    req.user = user.data;
    logger.info(
      {
        path: req.path,
        method: req.method,
        userId: user.data.id,
        role: user.data.role,
      },
      "Auth success",
    );
    next();
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    logger.error(
      { error: errorMessage, path: req.path },
      "Token verification failed",
    );
    if (error instanceof jwt.JsonWebTokenError) {
      sendErrorResponse(req, res, {
        status: HttpStatus.UNAUTHORIZED,
        description:
          error instanceof Error ? error.message : "Authentication Error",
      });
      return;
    }

    if (error instanceof jwt.TokenExpiredError) {
      sendErrorResponse(req, res, {
        status: HttpStatus.UNAUTHORIZED,
        description:
          error instanceof Error ? error.message : "Authentication Error",
      });
    }
    return sendErrorResponse(req, res, {
      status: HttpStatus.FORBIDDEN,
      description:
        error instanceof Error ? error.message : "Authentication Error",
    });
  }
};

export const optionalAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const token = getAccessToken(req);

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const verified = jwt.verify(token, serverConfig.jwtSecret!) as JwtPayload;
    const user = verified.sub
      ? await findUser("id", verified.sub)
      : { ok: false as const, error: new Error("Missing sub") };

    if (user.ok && user.data) {
      req.user = user.data;
    } else {
      req.user = null;
    }

    next();
  } catch (error) {
    logger.debug(
      {
        path: req.path,
        error: error instanceof Error ? error.message : "Unknown",
      },
      "Invalid token in optional auth, proceeding as guest",
    );
    req.user = null;
    next();
  }
};

export const methodBasedAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const method = req.method.toUpperCase();
  if (method === "GET" || method === "HEAD" || method === "OPTIONS") {
    return optionalAuth(req, res, next);
  }
  return authenticateToken(req, res, next);
};

export const requireRole = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user)
      return sendErrorResponse(req, res, { status: HttpStatus.UNAUTHORIZED });
    if (!allowedRoles.includes(req.user.role)) {
      return sendErrorResponse(req, res, { status: HttpStatus.FORBIDDEN });
    }
    next();
  };
};
