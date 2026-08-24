import { useQuery } from "@tanstack/react-query";
import {
  notificationsApi,
  type NotificationCollection,
} from "../clients/notifications.api";
import type { ApiClientError } from "../api/api.errors";

export const notificationsKeys = {
  all: ["notifications"] as const,
  notifications: () => [...notificationsKeys.all, "notifications"] as const,
  notification: (id: string | number) =>
    [...notificationsKeys.all, "notification", id] as const,
} as const;

/*
 * ========================================
 * QUERIES
 * ========================================
 */
export const notificationsQueries = {
  notifications: () => ({
    queryKey: notificationsKeys.notifications(),
    queryFn: () => notificationsApi.getNotifications(),
  }),
  notification: (id: string | number) => ({
    queryKey: notificationsKeys.notification(id),
    queryFn: () => {
      // If a single notification fetch method exists or falls back
      throw new Error("Method not implemented");
    },
    enabled: !!id,
  }),
};

export function useNotifications() {
  return useQuery<NotificationCollection, ApiClientError>(
    notificationsQueries.notifications(),
  );
}

export function useNotificationsSimple() {
  return useQuery<NotificationCollection, ApiClientError>(
    notificationsQueries.notifications(),
  );
}
