import { Request, Response, NextFunction } from "express";
import { randomUUID } from "crypto";

export const requestMetadata = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const requestId = req.get("X-Request-ID") || randomUUID();
  req.requestId = requestId;
  res.setHeader("X-Request-ID", requestId);
  res.locals.startTime = Date.now();
  res.locals.userAgent = req.get("user-agent");
  res.locals.clientIp =
    (req.headers["x-forwarded-for"] as string)?.split(",")[0].trim() || req.ip;

  res.locals.context = {
    requestId,
    method: req.method,
    path: req.originalUrl,
    timestamp: new Date().toISOString(),
  };
  const correlationId = req.get("X-Correlation-ID");
  if (correlationId) {
    res.locals.correlationId = correlationId;
    res.setHeader("X-Correlation-ID", correlationId);
  }
  const internalServiceToken = req.get("X-Internal-Service");
  res.locals.isInternalRequest = !!internalServiceToken;
  next();
};

export const requestMetrics = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const startTime = res.locals.startTime || Date.now();
  res.on("finish", () => {
    const duration = Date.now() - startTime;
    res.locals.metrics = {
      duration,
      statusCode: res.statusCode,
      contentLength: res.get("content-length"),
    };
  });
  next();
};
