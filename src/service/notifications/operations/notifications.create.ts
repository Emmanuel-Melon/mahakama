import { logger } from "@/lib/logger";
import { db } from "@/lib/drizzle";
import {
  notificationsSchema,
  userNotificationPreferences,
} from "../notifications.schema";
import { toResult } from "@/lib/drizzle/drizzle.utils";
import { DbResult } from "@/lib/drizzle/drizzle.types";
import type {
  Notification,
  NewNotification,
  NotificationPreferences,
  NewNotificationPreferences,
} from "../notifications.types";

export const createNotification = async (
  notificationData: NewNotification,
): Promise<DbResult<Notification>> => {
  const [notification] = await db
    .insert(notificationsSchema)
    .values({
      ...notificationData,
    })
    .returning();

  logger.info(
    `Created notification: ${notification.id} for user: ${notificationData.userId}`,
  );
  return toResult(notification);
};

export const setNotificationPreferences = async (
  preferences: NewNotificationPreferences,
): Promise<DbResult<NotificationPreferences>> => {
  const [preference] = await db
    .insert(userNotificationPreferences)
    .values({
      ...preferences,
    })
    .returning();

  logger.info(
    `✅ Saved user notification preferences for user: ${preferences.userId}`,
  );
  return toResult(preference);
};
