import { logger } from "@/lib/logger";
import { db } from "@/lib/drizzle";
import {
  notificationsSchema,
  userNotificationPreferences,
} from "../notifications.schema";
import {
  executeSingle,
  type DbResult,
} from "@/lib/drizzle/results/results.single";
import type {
  Notification,
  NewNotification,
  NotificationPreferences,
  NewNotificationPreferences,
} from "../notifications.types";

export const createNotification = async (
  notificationData: NewNotification,
): Promise<DbResult<Notification>> => {
  const result = await executeSingle(
    db
      .insert(notificationsSchema)
      .values({
        ...notificationData,
      })
      .returning()
      .then(([notification]) => notification),
  );

  if (result.ok) {
    logger.info(
      `Created notification: ${result.data.id} for user: ${notificationData.userId}`,
    );
  }

  return result;
};

export const createNotificationPreferences = async (
  preferences: NewNotificationPreferences,
): Promise<DbResult<NotificationPreferences>> => {
  const result = await executeSingle(
    db
      .insert(userNotificationPreferences)
      .values({
        ...preferences,
      })
      .returning()
      .then(([preference]) => preference),
  );

  if (result.ok) {
    logger.info(
      `✅ Saved user notification preferences for user: ${preferences.userId}`,
    );
  }

  return result;
};
