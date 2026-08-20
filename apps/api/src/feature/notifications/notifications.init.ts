import { NotificationsDomainRegistry } from "@/feature/notifications/notifications.registry";
import { logger } from "@/lib/logger";

import "@/feature/auth/notifications/auth.notifications";

/**
 * Initializes the notification system by registering all notification templates
 * from different domains (auth, decisions, occasions, etc.)
 */
export function initNotifications(): void {
  const keys = NotificationsDomainRegistry.registeredKeys();
  logger.info(`Notifications system initialized with ${keys.length} templates`);
}
