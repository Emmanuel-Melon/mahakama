import { Request, Response } from "express";
import { logger } from "@/lib/logger";

export const getBaseUrl = (req: Request): string => {
  return `${req.protocol}://${req.get("host")}`;
};

export const buildUrl = (req: Request, path: string): string => {
  const base = getBaseUrl(req);
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${cleanPath}`;
};

export function logRoute(req: Request, res: Response) {
  const { method, originalUrl } = req;
  const route = originalUrl.split("?")[0];

  let logMessage = `${method} ${route}`;
  let logLevel: "info" | "warn" | "error" = "info";
  let status = "completed";

  if (res.statusCode >= 500) {
    logLevel = "error";
    status = "server error";
  } else if (res.statusCode >= 400) {
    logLevel = "warn";
    status = "client error";
  }

  const logData = {
    reqId: req.requestId,
    method,
    url: originalUrl,
    status: res.statusCode,
    statusType: status,
  };
  logger[logLevel](logData, `${logMessage} ${status}`);
}
