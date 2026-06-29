import { NextFunction, Request, Response } from "express";
import { serializeJsonApi, serializeError } from "./express.serializer";
import {
  JsonApiResponseConfig,
  ErrorResponseConfig,
  JsonApiResponse,
  JsonApiErrorResponse,
  SSEEvent,
  SSEOptions,
  SuccessResponseOptions,
  ErrorResponseOptions,
} from "./express.types";
import z from "zod";
import { ResponseLinksSchema, ResponseMetadataSchema } from "./express.schema";

export const asyncHandler = <T>(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<T>,
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export const sendErrorResponse = (
  req: Request,
  res: Response,
  errorConfig: ErrorResponseConfig,
  opts?: ErrorResponseOptions,
): Response<JsonApiErrorResponse> => {
  const { error } = serializeError(req, errorConfig);
  return res.status(errorConfig.status.statusCode).json({ errors: [error] });
};

export const sendSuccessResponse = <T>(
  req: Request,
  res: Response,
  responseConfig: JsonApiResponseConfig<T>,
  opts?: SuccessResponseOptions,
): Response<JsonApiResponse<T>> => {
  const { data, metadata } = serializeJsonApi(req, {
    responseConfig,
    metadata: opts?.additionalMeta,
  });

  const response = {
    data,
    links: {
      self: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
      ...opts?.links,
    },
    metadata: metadata,
  };
  return res.status(opts?.status?.statusCode || 200).json(response);
};

export const initSSE = (res: Response, options?: SSEOptions) => {
  const defaultHeaders = {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no", // Disable nginx buffering
    ...options?.headers,
  };

  res.writeHead(200, defaultHeaders);
  res.write(": connected\n\n");

  const sendEvent = <T, Type extends string = string>(
    event:
      | SSEEvent<T, Type>
      | { type: Type; data: T; id?: string; retry?: number },
  ) => {
    const { type, data = {} as T, id, retry } = event;

    if (id) {
      res.write(`id: ${id}\n`);
    }
    if (retry) {
      res.write(`retry: ${retry}\n`);
    }

    res.write(`event: ${type}\n`);
    res.write(`data: ${JSON.stringify(data || {})}\n\n`);

    if (options?.metadata) {
      console.debug(`[${options.metadata.name}] SSE sent:`, {
        ...options.metadata,
        eventType: type,
        eventData: data,
      });
    }
  };

  const sendError = (error: {
    message: string;
    code?: string;
    details?: unknown;
  }) => {
    sendEvent({
      type: "error",
      data: { success: false, error },
    });
  };

  const close = () => {
    sendEvent({ type: "done" });
    res.end();
  };

  return {
    sendEvent,
    sendError,
    close,
    // Helper method for type-safe events
    createEvent: <T, Type extends string = string>(
      type: Type,
      data: T,
      options?: { id?: string; retry?: number },
    ) => sendEvent({ type, data, ...options }),
  };
};

export const createSuccessResponseSchema = <T extends z.ZodTypeAny>(
  dataSchema: T,
  description: string = "Successful response",
) => {
  return z
    .object({
      data: dataSchema,
      links: ResponseLinksSchema.optional(),
      metadata: ResponseMetadataSchema,
    })
    .openapi({
      description,
    });
};
