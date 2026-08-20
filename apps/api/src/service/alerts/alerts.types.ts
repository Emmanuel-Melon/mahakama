import { z } from "zod";

/*
 * ==========================================
 * ALERT CONTENT & SEVERITY TYPES
 * ==========================================
 */
export type AlertChannel = (
  to: string,
  subject: string,
  html: string,
) => Promise<void>;

export type AlertSeverity = "critical" | "warning" | "info";

export const alertContentSchema = z.object({
  subject: z.string(),
  bodyHtml: z.string(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type AlertContent = z.infer<typeof alertContentSchema>;

/*
 * ==========================================
 * ALERT TEMPLATE & REGISTRY TYPES
 * ==========================================
 */

export const alertTemplateDescriptorSchema = z.object({
  key: z.string(),
  schema: z.instanceof(z.ZodType),
});

export type AlertTemplateDescriptor<T extends z.ZodSchema = z.ZodSchema> = {
  key: string;
  schema: T;
};

export type AlertContentGenerator<T = unknown> = (
  data: T,
) => AlertContent | Promise<AlertContent>;

export type AlertTopicEntry = {
  map: Record<string, AlertTemplateDescriptor>;
  generators: Record<string, AlertContentGenerator<any>>;
};

export type InferTemplateData<T> =
  T extends AlertTemplateDescriptor<infer S> ? z.infer<S> : never;

/*
 * ==========================================
 * ALERT PAYLOAD SCHEMAS & TYPES
 * ==========================================
 */

export const deadLetterPayloadSchema = z.object({
  originalQueue: z.string(),
  originalJobId: z.string(),
  event: z.string(),
  error: z.object({
    message: z.string(),
    name: z.string().optional(),
    stack: z.string().optional(),
  }),
  retryCount: z.number(),
  failedAt: z.string(),
  correlationId: z.string().optional(),
});

export const circuitBreakerPayloadSchema = z.object({
  breakerName: z.string(),
  service: z.enum(["brevo", "stripe", "storage"]),
  state: z.enum(["OPEN", "HALF_OPEN", "CLOSED"]),
  stats: z.object({
    fires: z.number(),
    failures: z.number(),
    successes: z.number(),
  }),
  resetTimeoutMs: z.number().optional(),
});

export type DeadLetterAlertPayload = z.infer<typeof deadLetterPayloadSchema>;
export type CircuitBreakerAlertPayload = z.infer<
  typeof circuitBreakerPayloadSchema
>;
