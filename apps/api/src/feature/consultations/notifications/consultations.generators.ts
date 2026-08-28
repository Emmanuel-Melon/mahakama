import { createNotificationGenerators } from "@/feature/notifications/notifications.core";
import {
  ConsultationRequestedNotificationSchema,
  ConsultationStatusChangedNotificationSchema,
} from "../consultations.types";
import { consultationEmailRenderers } from "./consultations.emails";

export const ConsultationNotificationTemplates = {
  CONSULTATION_REQUESTED: {
    key: "CONSULTATION_REQUESTED",
    schema: ConsultationRequestedNotificationSchema,
  },
  CONSULTATION_STATUS_CHANGED: {
    key: "CONSULTATION_STATUS_CHANGED",
    schema: ConsultationStatusChangedNotificationSchema,
  },
} as const;

export const consultationNotificationGenerators = createNotificationGenerators(
  ConsultationNotificationTemplates,
)({
  CONSULTATION_REQUESTED: (data) => ({
    title: "New Consultation Request",
    message: `${data.customerName} has requested a consultation with you.`,
    emailHtml: consultationEmailRenderers.consultationRequested(data),
    action: {
      label: "View Request",
      url: `/consultations/${data.consultationId}`,
      type: "primary" as const,
    },
    metadata: {
      consultationId: data.consultationId,
      customerName: data.customerName,
    },
  }),

  CONSULTATION_STATUS_CHANGED: (data) => ({
    title: "Consultation Status Updated",
    message: `Your consultation status changed to ${data.status}.`,
    emailHtml: consultationEmailRenderers.consultationStatusChanged(data),
    action: {
      label: "View Consultation",
      url: `/consultations/${data.consultationId}`,
      type: "primary" as const,
    },
    metadata: {
      consultationId: data.consultationId,
      status: data.status,
    },
  }),
});
