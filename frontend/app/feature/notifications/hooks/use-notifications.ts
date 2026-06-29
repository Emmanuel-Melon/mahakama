import { useQuery } from '@tanstack/react-query';
import { notificationsApi } from '~/lib/api/notifications.api';
import type { Notification } from '~/lib/api/notifications.api';
import type { components } from "~/lib/api/generated/api.types";

export type JsonApiErrorResponse = components["schemas"]["JsonApiErrorResponse"];

export const notificationsKeys = {
    all: ['notifications'] as const,
    notifications: () => [...notificationsKeys.all, 'notifications'] as const,
    notification: (id: string | number) => [...notificationsKeys.all, 'notification', id] as const,
};

export function useNotifications() {
    return useQuery<Notification[], JsonApiErrorResponse>({
        queryKey: notificationsKeys.notifications(),
        queryFn: async () => {
            return await notificationsApi.getNotifications();
        },
        meta: {
            errorToast: true,
            errorMessage: 'Failed to load notifications',
        },
    });
}

export function useNotificationsSimple() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationsApi.getNotifications(), // "Just works"
  });
}