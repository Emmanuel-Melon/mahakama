import { logger } from "@/lib/logger";

import type {
  BaseNotificationContent,
  NotificationDomainEntry,
  RegistryEntry,
} from "./notifications.types";

const registry = new Map<string, RegistryEntry>();

export class NotificationsDomainRegistry {
  /**
   * Automatically flattens domain template blocks into core routing engines
   */
  static register({ map, generators }: NotificationDomainEntry): void {
    for (const [enumKey, spec] of Object.entries(map)) {
      const generator = generators[enumKey];

      if (!generator) {
        throw new Error(
          `[NotificationsDomainRegistry] Missing content generator mapping context for template descriptor identifier: "${spec.key}" (Enum lookup index key: "${enumKey}").`,
        );
      }

      if (registry.has(spec.key)) {
        logger.warn(
          { templateKey: spec.key, enumKey },
          "[NotificationsDomainRegistry] Context key collisions encountered across loaded module domains. Overwriting trace pointer.",
        );
      }

      registry.set(spec.key, { schema: spec.schema, generator });
      logger.debug(
        { templateKey: spec.key },
        "Notification system layout mapping compiled successfully",
      );
    }
  }

  /**
   * Evaluates inbound schema structures cleanly prior to handing down pipeline formatting layers
   */
  static async generateBaseNotificationContent(
    templateKey: string,
    data: unknown,
  ): Promise<BaseNotificationContent> {
    const entry = registry.get(templateKey);

    if (!entry) {
      logger.error(
        { templateKey },
        "Requested layout route string context doesn't point to any registered compiler keys",
      );
      if (process.env.NODE_ENV !== "production") {
        throw new Error(
          `[NotificationsDomainRegistry] Lookup path failed for key: "${templateKey}". Verify feature domain index configuration loads.`,
        );
      }
      return {
        title: "System Update",
        message: "You have received a notification update.",
      };
    }

    try {
      const validatedData = entry.schema.parse(data);
      return await entry.generator(validatedData);
    } catch (error) {
      logger.error(
        { templateKey, error, data },
        "Payload structural validation failed against template constraints",
      );
      throw new Error(
        `[NotificationsDomainRegistry] Data formatting validation failure parsing context across string payload router matching: "${templateKey}"`,
      );
    }
  }

  static registeredKeys(): string[] {
    return Array.from(registry.keys());
  }
}
