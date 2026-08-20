import { z } from "zod";

import { logger } from "@/lib/logger";

import type {
  AlertContent,
  AlertContentGenerator,
  AlertTemplateDescriptor,
  AlertTopicEntry,
} from "./alerts.types";

const registry = new Map<
  string,
  { schema: z.ZodSchema; generator: AlertContentGenerator }
>();

export class AlertRegistry {
  /**
   * Register a topic's templates and generators.
   */
  static register({ map, generators }: AlertTopicEntry): void {
    for (const [enumKey, spec] of Object.entries(map)) {
      const generator = generators[enumKey];

      if (!generator) {
        throw new Error(
          `[AlertRegistry] Missing content generator for template: "${spec.key}" (enum: "${enumKey}")`,
        );
      }

      if (registry.has(spec.key)) {
        logger.warn(
          { templateKey: spec.key, enumKey },
          "[AlertRegistry] Template key collision — overwriting",
        );
      }

      registry.set(spec.key, { schema: spec.schema, generator });
      logger.debug({ templateKey: spec.key }, "Alert template registered");
    }
  }

  /**
   * Generate alert content with Zod validation.
   */
  static async generateAlertContent(
    templateKey: string,
    data: unknown,
  ): Promise<AlertContent> {
    const entry = registry.get(templateKey);

    if (!entry) {
      logger.error({ templateKey }, "Alert template not found");
      if (process.env.NODE_ENV !== "production") {
        throw new Error(`[AlertRegistry] Unknown template: "${templateKey}"`);
      }
      return {
        subject: "System Alert",
        bodyHtml:
          "<p>An alert was triggered but the template was not found.</p>",
      };
    }

    try {
      const validatedData = entry.schema.parse(data);
      return await entry.generator(validatedData);
    } catch (error) {
      logger.error(
        { templateKey, error, data },
        "Alert data validation failed",
      );
      throw new Error(
        `[AlertRegistry] Validation failed for: "${templateKey}"`,
      );
    }
  }

  static registeredKeys(): string[] {
    return Array.from(registry.keys());
  }
}
