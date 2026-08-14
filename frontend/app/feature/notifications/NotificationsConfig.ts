import { defineRoutes } from "../../lib/nav/nav.paths";

export const notificationsRoutes = defineRoutes({
  index: { path: "notifications", file: "routes/notifications/index.tsx" },
});

export const NotificationsPaths = notificationsRoutes.to;

const API_V1 = "/v1";

export const NOTIFICATIONS_API_ROUTES = {
  ROOT: `${API_V1}/notifications`,
  NOTIFICATION: `${API_V1}/notifications/:notificationId`,
} as const;
