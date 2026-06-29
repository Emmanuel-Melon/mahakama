import { serverConfig } from "@/config";
import { mapErrorToResponse } from "@/errors";
import { sendErrorResponse } from "@/lib/express/express.response";
import { EntityNotFoundError, AppError } from "@/lib/http/http.error";
import { logger } from "@/lib/logger";
import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export const globalErrorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (res.headersSent) return next(error);

  const { status, message, meta } = mapErrorToResponse(error);

  const isOperational =
    (error instanceof AppError && error.isOperational) ||
    error instanceof EntityNotFoundError ||
    error instanceof ZodError;

  const errorLog = {
    requestId: req.requestId,
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
      isOperational,
    },
    request: { method: req.method, url: req.originalUrl },
    timestamp: new Date().toISOString(),
  };

  isOperational
    ? logger.warn(errorLog, `Operational error: ${message}`)
    : logger.error(errorLog, `Critical error: ${error.message}`);

  sendErrorResponse(
    req,
    res,
    {
      status,
      description: message,
      source: { pointer: req.originalUrl, method: req.method },
    },
    {
      additionalMeta: {
        ...meta,
        ...(serverConfig.isDevelopment && {
          stack: error.stack,
          errorType: error.constructor.name,
        }),
      },
    },
  );
};
