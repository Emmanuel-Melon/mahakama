import { defineRoutes } from "@mah/client/nav";
import en from "../../locales/en/notifications.json";
import ar from "../../locales/ar/notifications.json";
import type { I18nConfig } from "@mah/client/i18n";

export const notificationsRoutes = defineRoutes({
  index: { path: "notifications", file: "routes/notifications/index.tsx" },
});

export const NotificationsPaths = notificationsRoutes.to;

const API_V1 = "/v1";

export const NOTIFICATIONS_API_ROUTES = {
  ROOT: `${API_V1}/notifications`,
  NOTIFICATION: `${API_V1}/notifications/:notificationId`,
} as const;

export const notificationsI18n: I18nConfig<"notifications", typeof en> = {
  namespace: "notifications",
  resources: {
    en,
    ar,
  },
};
