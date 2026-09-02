import { defineRoutes } from "@mah/client/nav";

export const notificationsRoutes = defineRoutes({
  index: { path: "notifications", file: "routes/notifications/index.tsx" },
});

export const NotificationsPaths = notificationsRoutes.to;
