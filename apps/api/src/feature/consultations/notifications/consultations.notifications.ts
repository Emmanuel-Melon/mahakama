import { NotificationDomain } from "@/feature/notifications/notifications.config";
import { createNotificationDispatcher } from "@/feature/notifications/notifications.core";
import { NotificationsDomainRegistry } from "@/feature/notifications/notifications.registry";

import {
  consultationNotificationGenerators,
  ConsultationNotificationTemplates,
} from "./consultations.generators";

export type ConsultationNotificationType =
  keyof typeof ConsultationNotificationTemplates;

export const ConsultationNotificationEvent = {
  ConsultationRequested: "CONSULTATION_REQUESTED",
  ConsultationStatusChanged: "CONSULTATION_STATUS_CHANGED",
} as const satisfies Record<string, ConsultationNotificationType>;

NotificationsDomainRegistry.register({
  map: ConsultationNotificationTemplates,
  generators: consultationNotificationGenerators,
});

export const dispatchConsultationNotification = createNotificationDispatcher(
  NotificationDomain.Consultations,
  ConsultationNotificationTemplates,
);
