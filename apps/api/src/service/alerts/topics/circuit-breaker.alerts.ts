import { compileEmailBlocks } from "@/feature/notifications/notifications.emails";

import { createAlertGenerators } from "../alerts.core";
import { circuitBreakerPayloadSchema } from "../alerts.types";

export const CircuitBreakerAlertTemplates = {
  STORAGE_DEGRADED: {
    key: "STORAGE_DEGRADED",
    schema: circuitBreakerPayloadSchema,
  },
} as const;

const breakerContent = (
  data: {
    breakerName: string;
    state: string;
    stats: { fires: number; failures: number; successes: number };
    resetTimeoutMs?: number;
  },
  serviceLabel: string,
) => ({
  subject: `⚠️ ${serviceLabel} Service Degradation: ${data.breakerName}`,
  bodyHtml: compileEmailBlocks([
    { heading: `${serviceLabel} Circuit Breaker Triggered` },
    {
      paragraph: `The ${serviceLabel.toLowerCase()} service circuit breaker has transitioned to <strong>${data.state}</strong>.`,
    },
    {
      kvList: {
        Breaker: data.breakerName,
        State: data.state,
        "Total Calls": data.stats.fires,
        Failures: data.stats.failures,
        Successes: data.stats.successes,
        ...(data.resetTimeoutMs && {
          "Reset In": `${data.resetTimeoutMs / 1000}s`,
        }),
      },
    },
    {
      hint:
        data.state === "OPEN"
          ? "All requests are currently failing fast. The service will be retried when the timeout expires."
          : "The breaker is testing if the service has recovered.",
    },
  ]),
  metadata: { service: serviceLabel.toLowerCase(), breakerState: data.state },
});

export const circuitBreakerAlertGenerators = createAlertGenerators(
  CircuitBreakerAlertTemplates,
)({
  STORAGE_DEGRADED: (data) => breakerContent(data, "Storage"),
});
