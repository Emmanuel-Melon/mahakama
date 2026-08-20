import { NotificationDomain } from "@/feature/notifications/notifications.config";
import { createNotificationDispatcher } from "@/feature/notifications/notifications.core";
import { NotificationsDomainRegistry } from "@/feature/notifications/notifications.registry";

import {
  authNotificationGenerators,
  AuthNotificationTemplates,
} from "./auth.generators";

export type AuthNotificationType = keyof typeof AuthNotificationTemplates;

export const AuthNotificationEvent = {
  LoginAlert: "LOGIN_ALERT",
  PasswordReset: "PASSWORD_RESET",
  EmailVerification: "EMAIL_VERIFICATION",
} as const satisfies Record<string, AuthNotificationType>;

NotificationsDomainRegistry.register({
  map: AuthNotificationTemplates,
  generators: authNotificationGenerators,
});

export const dispatchAuthNotification = createNotificationDispatcher(
  NotificationDomain.Auth,
  AuthNotificationTemplates,
);
