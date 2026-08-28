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
      user: req.user ? { id: req.user.id, role: req.user.role } : null,
      cookieNames: Object.keys(req.cookies ?? {}),
      setCookieNames: (res.getHeaders()["set-cookie"] as string[] | undefined)
        ?.map((c) => c.split("=")[0]),
      message: "Request received",
    },
    "Incoming request",
  );
  res.on("finish", () => {
    logRoute(req, res);
  });
  next();
};
