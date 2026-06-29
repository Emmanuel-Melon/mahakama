import { Request, Response, NextFunction } from "express";

export const ips = new Map<string, string>();

const getFirstHeader = (value: string | string[] | undefined): string => {
  if (!value) return "";
  return Array.isArray(value) ? value[0] || "" : value;
};

export const getIpAddress = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  // Extract a temporary IP to check against the map
  const forwardedFor = getFirstHeader(req.headers["x-forwarded-for"]);
  const firstIp = forwardedFor ? forwardedFor.split(",")[0].trim() : "";

  const ip =
    getFirstHeader(req.headers["x-real-ip"]) ||
    firstIp ||
    req.ip ||
    req.connection.remoteAddress ||
    req.socket?.remoteAddress ||
    "127.0.0.1";

  // Check if we've seen this IP before
  if (ips.has(ip)) {
    req.userIP = ip;
    return next();
  }

  // First time seeing this IP - store it
  ips.set(ip, ip);
  req.userIP = ip;
  next();
};
