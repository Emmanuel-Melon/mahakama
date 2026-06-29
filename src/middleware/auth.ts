import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { serverConfig } from "@/config";
import { findUserById } from "@/feature/users/operations/users.find";
import { logger } from "@/lib/logger";
import { sendErrorResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/http-status";

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token =
    req.cookies?.token || req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    sendErrorResponse(req, res, {
      status: HttpStatus.UNAUTHORIZED,
      description: "Authentication Error",
    });
    return;
  }
  try {
    const verified = jwt.verify(token!, serverConfig.jwtSecret!) as JwtPayload;
    const user = await findUserById(verified.id);
    if (!user) {
      sendErrorResponse(req, res, {
        status: HttpStatus.NOT_FOUND,
        description: "User not found for valid token",
      });
      return;
    }
    req.user = user.data;
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
  const token =
    req.cookies?.token || req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const verified = jwt.verify(token, serverConfig.jwtSecret!) as JwtPayload;
    const user = await findUserById(verified.id);

    if (user) {
      req.user = user;
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
