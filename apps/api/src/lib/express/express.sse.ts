import { Response } from "express";

import { SSEEvent, SSEOptions } from "./express.types";

export interface SSEStreamOptions extends SSEOptions {
  keepAliveIntervalMs?: number;
  maxWaitMs?: number;
  onTimeout?: (
    sendError: (error: { message: string; code?: string }) => void,
    close: () => void,
  ) => void;
}

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

  const sendEvent = (
    event: { type: string; data?: any; id?: string; retry?: number },
  ) => {
    const { type, data = {}, id, retry } = event;

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

export const handleSSEStream = (
  res: Response,
  handler: (
    sse: ReturnType<typeof initSSE>,
    stop: () => void,
  ) => Promise<void> | void,
  options: SSEStreamOptions = {},
) => {
  const {
    keepAliveIntervalMs = 15_000,
    maxWaitMs = 600_000,
    onTimeout,
    ...sseOptions
  } = options;

  const sse = initSSE(res, sseOptions);

  let keepAliveTimer: ReturnType<typeof setInterval> | undefined;
  let timeoutTimer: ReturnType<typeof setTimeout> | undefined;
  let terminated = false;

  const stopTimers = () => {
    if (keepAliveTimer) clearInterval(keepAliveTimer);
    if (timeoutTimer) clearTimeout(timeoutTimer);
  };

  const cleanup = () => {
    if (terminated) return;
    terminated = true;
    stopTimers();
  };

  const closeStream = () => {
    cleanup();
    if (!res.writableEnded) {
      res.end();
    }
  };

  // Setup keep-alive pings
  keepAliveTimer = setInterval(() => {
    if (!res.writableEnded) res.write(": ping\n\n");
  }, keepAliveIntervalMs);
  keepAliveTimer.unref?.();

  // Setup maximum duration timeout
  timeoutTimer = setTimeout(() => {
    if (terminated || res.writableEnded) return;
    cleanup();

    if (onTimeout) {
      onTimeout(sse.sendError, closeStream);
    } else {
      sse.sendError({
        message: "Stream processing timed out",
        code: "STREAM_TIMEOUT",
      });
      closeStream();
    }
  }, maxWaitMs);
  timeoutTimer.unref?.();

  // Handle client abrupt disconnects
  res.on("close", () => {
    cleanup();
  });

  // Execute the main stream logic safely
  Promise.resolve(handler(sse, closeStream)).catch((error) => {
    if (!terminated) {
      cleanup();
      sse.sendError({
        message:
          error instanceof Error ? error.message : "Internal stream error",
        code: "STREAM_INTERNAL_ERROR",
      });
      closeStream();
    }
  });
};
