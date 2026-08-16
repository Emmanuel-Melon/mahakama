import { NextFunction, Request, Response } from "express";
import { logRoute } from "@/lib/express/express.utils";
import { logger } from "@/lib/logger";

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  logger.info(
    {
      reqId: req.requestId,
      method: req.method,
      url: req.originalUrl,
      message: "Request received",
    },
    "Incoming request",
  );
  res.on("finish", () => {
    logRoute(req, res);
  });
  next();
};
