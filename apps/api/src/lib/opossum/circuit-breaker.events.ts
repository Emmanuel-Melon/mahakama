import CircuitBreaker from "opossum";

import { logger } from "@/lib/logger";
import type { EventHandlerContext } from "./circuit-breaker.types";
import { SystemAlerter } from "@/service/alerts";

const createLogHandler =
  (ctx: EventHandlerContext) =>
  (
    level: "error" | "warn" | "info",
    event: string,
    message: string,
    extra?: Record<string, unknown>,
  ) => {
    logger[level]({ breaker: ctx.name, event, ...extra }, message);
  };

export const attachBreakerEvents = (
  breaker: CircuitBreaker,
  ctx: EventHandlerContext,
) => {
  const log = createLogHandler(ctx);

  breaker.on("open", () => {
    log(
      "error",
      "open",
      `Circuit breaker OPEN: ${ctx.name} short-circuiting for ${ctx.config.resetTimeout / 1000}s`,
      { resetTimeoutMs: ctx.config.resetTimeout },
    );

    if (!ctx.service) {
      log(
        "warn",
        "open",
        `Breaker ${ctx.name} has no service tag — skipping alert`,
      );
      return;
    }

    switch (ctx.service) {
      case "storage":
        void SystemAlerter.storageDegraded({
          breakerName: ctx.name,
          service: ctx.service,
          state: "OPEN",
          stats: {
            fires: breaker.stats.fires,
            failures: breaker.stats.failures,
            successes: breaker.stats.successes,
          },
          resetTimeoutMs: ctx.config.resetTimeout,
        });
        break;
    }
  });

  breaker.on("halfOpen", () => {
    log(
      "warn",
      "halfOpen",
      `Circuit breaker HALF-OPEN: ${ctx.name} testing recovery`,
    );
    // No alert — too noisy
  });

  breaker.on("close", () => {
    log("info", "close", `Circuit breaker CLOSED: ${ctx.name} recovered`);
  });

  breaker.on("timeout", () => {
    log(
      "warn",
      "timeout",
      `Circuit breaker TIMEOUT: ${ctx.name} exceeded ${ctx.config.timeout}ms`,
      {
        timeoutMs: ctx.config.timeout,
      },
    );
  });

  breaker.on("reject", () => {
    log(
      "warn",
      "reject",
      `Circuit breaker REJECT: ${ctx.name} call blocked (breaker open)`,
    );
  });

  breaker.on("failure", (err: Error) => {
    log("error", "failure", `Circuit breaker call failed: ${ctx.name}`, {
      error: err?.message,
    });
  });

  breaker.on("fallback", (_result: unknown, err: Error) => {
    log("error", "fallback", `Circuit breaker FALLBACK invoked: ${ctx.name}`, {
      error: err?.message,
    });
  });
};
