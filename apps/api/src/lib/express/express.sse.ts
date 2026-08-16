import { Response } from "express";

import { SSEEvent, SSEOptions } from "./express.types";

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
      SSEEvent<T, Type> | { type: Type; data: T; id?: string; retry?: number },
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
