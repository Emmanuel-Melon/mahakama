import { db } from "@/lib/drizzle";
import {
  notificationsSchema,
  userNotificationPreferences,
} from "../notifications.schema";
import {
  Notification,
  NewNotification,
  NotificationPreferences,
} from "../notifications.types";
import { eq } from "drizzle-orm";
import { toResult } from "@/lib/drizzle/drizzle.utils";
import { DbResult } from "@/lib/drizzle/drizzle.types";

export async function updateNotification(
  id: string,
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
    .where(eq(notificationsSchema.id, id))
    .returning();

  return toResult(updatedNotification);
}

export async function updateNotificationPreferences(
  userId: string,
  data: Partial<NotificationPreferences>,
): Promise<DbResult<NotificationPreferences>> {
  const [updatedPreferences] = await db
    .update(userNotificationPreferences)
    .set({
      emailEnabled: data.emailEnabled,
      pushEnabled: data.pushEnabled,
      inAppEnabled: data.inAppEnabled,
    })
    .where(eq(userNotificationPreferences.userId, userId))
    .returning();

  return toResult(updatedPreferences);
}
