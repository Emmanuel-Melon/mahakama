import { LoginAlertNotificationSchema } from "./auth.types";
import { createNotificationGenerators } from "@/service/notifications/notifications.factory";

export const AuthNotificationTemplateMap = {
  LOGIN_ALERT: {
    key: "login_alert",
    schema: LoginAlertNotificationSchema,
  },
} as const;

export const authNotificationGenerators = createNotificationGenerators(
  AuthNotificationTemplateMap,
)({
  LOGIN_ALERT: (data) => ({
    title: "New Login Detected",
    message: `A new login was detected from ${data.location || "an unknown location"}`,
    action: {
      label: "Review Activity",
      url: `/auth/security/${data.actorId}`,
      type: "primary" as const,
    },
    metadata: {
      loginTime: data.loginTime,
      location: data.location,
      device: data.device,
      actorId: data.actorId,
    },
  }),
});
