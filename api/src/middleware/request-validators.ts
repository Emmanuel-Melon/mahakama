import { NextFunction, Response, Request } from "express";
import { z } from "zod";
import { sendErrorResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/lib/http/http.status";
import { parseHttpData } from "@/lib/http/http.utils";

export enum HttpLocation {
  Body = "body",
  Params = "params",
  Query = "query",
  Headers = "headers",
}

export function validateHttpRequest<T extends z.ZodTypeAny>(
  schema: T,
  location: HttpLocation,
) {
  return (req: Request, res: Response, next: NextFunction) => {
    const validation = parseHttpData(schema, req[location]);

    if (!validation.success) {
      const formattedErrors = validation.errors.map((issue) => ({
        status: HttpStatus.BAD_REQUEST.statusCode.toString(),
        code: issue.code,
        title: "Validation Error",
        detail: issue.message,
        source: {
          pointer: `/${location}/${issue.path.join("/")}`,
        },
        meta: {
          requestId: req.requestId,
          timestamp: new Date().toISOString(),
        },
      }));

      return sendErrorResponse(req, res, formattedErrors);
    }

    if (!req.validated) {
      req.validated = {};
    }

    req.validated[location] = validation.data;
    next();
  };
}
