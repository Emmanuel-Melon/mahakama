import { and, eq } from "drizzle-orm";

import { db } from "@/lib/drizzle";
import type { DbCollection, DbResult } from "@/lib/drizzle/drizzle.types";
import { toCollection } from "@/lib/drizzle/results/results.collection";
import { executeSingle } from "@/lib/drizzle/results/results.single";

import {
  notificationsSchema,
  userNotificationPreferences,
} from "../notifications.schema";
import type {
  Notification,
  NotificationColumn,
  NotificationColumnKey,
  NotificationPreferences,
  PreferencesColumn,
  PreferencesColumnKey,
  UpdateNotification,
  UpdateNotificationPreferences,
} from "../notifications.types";

export async function updateNotification<K extends NotificationColumnKey>(
  field: K,
  value: NotificationColumn[K]["_"]["data"],
  data: UpdateNotification,
): Promise<DbResult<Notification>> {
  return executeSingle(
    db
      .update(notificationsSchema)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(notificationsSchema[field], value))
      .returning()
      .then(([updatedNotification]) => updatedNotification),
  );
}

export async function updateNotificationPreferences<
  K extends PreferencesColumnKey,
>(
  field: K,
  value: PreferencesColumn[K]["_"]["data"],
  data: UpdateNotificationPreferences,
): Promise<DbResult<NotificationPreferences>> {
  return executeSingle(
    db
      .update(userNotificationPreferences)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(userNotificationPreferences[field], value))
      .returning()
      .then(([updatedPreferences]) => updatedPreferences),
  );
}

export async function markAsRead(
  id: string,
  userId: string,
): Promise<DbResult<Notification>> {
  return updateNotification("id", id, {
    isRead: true,
    readAt: new Date(),
  });
}

export async function toggleReadStatus(
  id: string,
  isRead: boolean,
): Promise<DbResult<Notification>> {
  return updateNotification("id", id, {
    isRead,
    readAt: isRead ? new Date() : null,
  });
}

export async function markAllAsRead(
  userId: string,
): Promise<DbCollection<Notification>> {
  const results = await db
    .update(notificationsSchema)
    .set({
      isRead: true,
      readAt: new Date(),
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(notificationsSchema.userId, userId),
        eq(notificationsSchema.isRead, false),
        eq(notificationsSchema.channel, "in_app"),
      ),
    )
    .returning();

  return toCollection(results);
}
