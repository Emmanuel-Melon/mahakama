import { BaseNotificationContent, RegistryEntry } from "./notifications.types";
import { logger } from "@/lib/logger";
import { NOTIFICATION_DOMAINS } from "./notifications.config";

const registry = NOTIFICATION_DOMAINS.reduce<Record<string, RegistryEntry>>(
  (acc, { map, generators }) => {
    for (const [enumKey, spec] of Object.entries(map)) {
      const generator = generators[enumKey];
      if (!generator) {
        throw new Error(
          `No generator found for template key "${spec.key}" (enum key: "${enumKey}")`,
        );
      }
      acc[spec.key] = { schema: spec.schema, generator };
    }
    return acc;
  },
  {},
);

export class NotificationsRegistry {
  /**
   * Generate base notification content for a given template key and data.
   * The data is validated against the schema registered for that template key.
   */
  static async generateBaseNotificationContent(
    templateKey: string,
    data: unknown,
  ): Promise<BaseNotificationContent> {
    const entry = registry[templateKey];
    if (!entry) {
      logger.error({ templateKey }, "No notification generator found");
      if (process.env.NODE_ENV !== "production") {
        throw new Error(
          `No notification generator registered for key: "${templateKey}"`,
        );
      }
      return { title: "Update", message: "You have a new notification." };
    }

    try {
      const validatedData = entry.schema.parse(data);
      return entry.generator(validatedData);
    } catch (error) {
      logger.error(
        { templateKey, error, data },
        "Notification data validation failed",
      );
      throw new Error(
        `Invalid notification data for template "${templateKey}"`,
      );
    }
  }
}
