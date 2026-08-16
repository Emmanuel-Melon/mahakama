import { db } from "@/lib/drizzle";
import {
  notificationsSchema,
  userNotificationPreferences,
} from "../notifications.schema";
import { eq } from "drizzle-orm";
import {
  executeSingle,
  type DbResult,
} from "@/lib/drizzle/results/results.single";
import { toManyResult } from "@/lib/drizzle/drizzle.utils";
import { DbManyResult } from "@/lib/drizzle/drizzle.types";
import {
  Notification,
  NotificationColumn,
  NotificationColumnKey,
  NotificationFilters,
  NotificationPreferences,
  UserNotificationPreferencesColumn,
  UserNotificationPreferencesColumnKey,
} from "../notifications.types";
import { paginate } from "@/lib/drizzle/drizzle.paginate";

export const findNotification = async <K extends NotificationColumnKey>(
  field: K,
  value: NotificationColumn[K]["_"]["data"],
): Promise<DbResult<Notification>> => {
  return executeSingle(
    db.query.notificationsSchema.findFirst({
      where: eq(notificationsSchema[field], value),
    }),
  );
};

export async function findNotifications(
  query: NotificationFilters,
): Promise<DbManyResult<Notification>> {
  const filters = [];

  if (query.userId) {
    filters.push(eq(notificationsSchema.userId, query.userId));
  }

  if (query.type) {
    filters.push(eq(notificationsSchema.type, query.type));
  }

  const result = await paginate<"notificationsSchema", Notification>(
    "notificationsSchema",
    notificationsSchema,
    {
      ...query,
      filters,
      search: {
        q: query.q,
        columns: [notificationsSchema.title, notificationsSchema.message],
      },
    },
  );

  return toManyResult(result);
}

export const findNotificationPreferences = async <
  K extends UserNotificationPreferencesColumnKey,
>(
  field: K,
  value: UserNotificationPreferencesColumn[K]["_"]["data"],
): Promise<DbResult<NotificationPreferences>> => {
  return executeSingle(
    db.query.userNotificationPreferences.findFirst({
      where: eq(userNotificationPreferences[field], value),
    }),
  );
};
