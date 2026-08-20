import { db } from "@/lib/drizzle";
import { DbResult } from "@/lib/drizzle/drizzle.types";
import { executeSingle } from "@/lib/drizzle/results/results.single";
import { logger } from "@/lib/logger";

import {
  notificationsSchema,
  pushSubscriptionsSchema,
  userNotificationPreferences,
} from "../notifications.schema";
import type {
  NewNotification,
  NewNotificationPreferences,
  NewPushSubscription,
  Notification,
  NotificationPreferences,
  PushSubscription,
} from "../notifications.types";

export const createNotification = async (
  notificationData: NewNotification,
): Promise<DbResult<Notification>> => {
  return executeSingle(
    db
      .insert(notificationsSchema)
      .values({
        ...notificationData,
      })
      .returning()
      .then(([notification]) => {
        logger.info(
          `Created notification: ${notification.id} for user: ${notificationData.userId}`,
        );
        return notification;
      }),
  );
};

export const setNotificationPreferences = async (
  preferences: NewNotificationPreferences,
): Promise<DbResult<NotificationPreferences>> => {
  return executeSingle(
    db
      .insert(userNotificationPreferences)
      .values({
        ...preferences,
      })
      .returning()
      .then(([preference]) => {
        logger.info(
          `✅ Saved user notification preferences for user: ${preferences.userId}`,
        );
        return preference;
      }),
  );
};

export const savePushSubscription = async (
  userId: string,
  subscription: NewPushSubscription,
): Promise<DbResult<PushSubscription>> => {
  return executeSingle(
    db
      .insert(pushSubscriptionsSchema)
      .values({
        userId,
        endpoint: subscription.endpoint,
        keys: subscription.keys,
      })
      .onConflictDoUpdate({
        target: pushSubscriptionsSchema.endpoint,
        set: { keys: subscription.keys },
      })
      .returning()
      .then(([result]) => {
        logger.info(`Registered push device for user: ${userId}`);
        return result;
      }),
  );
};
