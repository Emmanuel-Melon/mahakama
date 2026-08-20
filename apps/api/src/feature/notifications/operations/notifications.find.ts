import { and, desc, eq } from "drizzle-orm";

import { db } from "@/lib/drizzle";
import type { DbCollection, DbResult } from "@/lib/drizzle/drizzle.types";
import { toCollection } from "@/lib/drizzle/results/results.collection";
import { executeSingle } from "@/lib/drizzle/results/results.single";

import { NotificationChannel } from "../notifications.config";
import {
  notificationsSchema,
  userNotificationPreferences,
} from "../notifications.schema";
import type {
  Notification,
  NotificationPreferences,
} from "../notifications.types";

export const findNotifications = async (
  userId: string,
): Promise<DbCollection<Notification>> => {
  const notifications = await db.query.notificationsSchema.findMany({
    where: and(
      eq(notificationsSchema.userId, userId),
      eq(notificationsSchema.channel, NotificationChannel.InApp),
    ),
    orderBy: [desc(notificationsSchema.createdAt)],
  });

  return toCollection(notifications);
};

export const findNotificationPreferences = async (
  userId: string,
): Promise<DbResult<NotificationPreferences>> => {
  const preferences = await executeSingle(
    db.query.userNotificationPreferences.findFirst({
      where: eq(userNotificationPreferences.userId, userId),
    }),
  );
  return preferences;
};
