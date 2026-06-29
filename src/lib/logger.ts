import { Request, Response } from "express";
import pino from "pino";

const isDevelopment = process.env.NODE_ENV !== "production";
export const envColor = isDevelopment ? "red" : "blue";

export const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  transport: isDevelopment
    ? {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:standard",
          ignore: "pid,hostname",
          messageFormat: "{msg}",
          levelFirst: true,
        },
      }
    : undefined,
  formatters: {
    level: (label) => ({ level: label.toUpperCase() }),
  },
  serializers: {
    req: (req: Request) => ({
      method: req.method,
      url: req.url,
      path: req.path,
      query: req.query,
      params: req.params,
      remoteAddress: req.ip || req.socket?.remoteAddress,
    }),
    res: pino.stdSerializers.res,
    err: pino.stdSerializers.err,
  },
});
