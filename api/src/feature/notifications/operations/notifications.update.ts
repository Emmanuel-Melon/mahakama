import { db } from "@/lib/drizzle";
import {
  notificationsSchema,
  userNotificationPreferences,
} from "../notifications.schema";
import {
  Notification,
  NewNotification,
  NotificationPreferences,
  NotificationColumn,
  NotificationColumnKey,
  UserNotificationPreferencesColumn,
  UserNotificationPreferencesColumnKey,
} from "../notifications.types";
import { eq } from "drizzle-orm";
import { toResult } from "@/lib/drizzle/drizzle.utils";
import { DbResult } from "@/lib/drizzle/drizzle.types";

export async function updateNotification<K extends NotificationColumnKey>(
  field: K,
  value: NotificationColumn[K]["_"]["data"],
  data: Partial<NewNotification>,
): Promise<DbResult<Notification>> {
  const [updatedNotification] = await db
    .update(notificationsSchema)
    .set({
      type: data.type,
      channel: data.channel,
      title: data.title,
      message: data.message,
      scheduledAt: data.scheduledAt,
      sentAt: data.sentAt,
      status: data.status,
      metadata: data.metadata,
      updatedAt: new Date(),
    })
    .where(eq(notificationsSchema[field], value))
    .returning();

  return toResult(updatedNotification);
}

export async function updateNotificationPreferences<
  K extends UserNotificationPreferencesColumnKey,
>(
  field: K,
  value: UserNotificationPreferencesColumn[K]["_"]["data"],
  data: Partial<NotificationPreferences>,
): Promise<DbResult<NotificationPreferences>> {
  const [updatedPreferences] = await db
    .update(userNotificationPreferences)
    .set({
      emailEnabled: data.emailEnabled,
      pushEnabled: data.pushEnabled,
      inAppEnabled: data.inAppEnabled,
    })
    .where(eq(userNotificationPreferences[field], value))
    .returning();

  return toResult(updatedPreferences);
}
