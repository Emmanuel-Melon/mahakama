import { compileEmailBlocks } from "@/feature/notifications/notifications.emails";

import type {
  ConsultationRequestedNotification,
  ConsultationStatusChangedNotification,
} from "../consultations.types";

export const consultationEmailRenderers = {
  consultationRequested: (data: ConsultationRequestedNotification) =>
    compileEmailBlocks(
      [
        { heading: "New Consultation Request" },
        {
          paragraph: `You have received a new consultation request from **${data.customerName}**.`,
        },
        {
          actions: [
            {
              label: "View Request",
              url: `/consultations/${data.consultationId}`,
            },
          ],
        },
        { hint: "Log in to your dashboard to accept or decline this request." },
      ].filter(Boolean),
    ),

  consultationStatusChanged: (data: ConsultationStatusChangedNotification) =>
    compileEmailBlocks(
      [
        { heading: "Consultation Status Update" },
        {
          paragraph: `The status of your consultation with **${data.lawyerName}** has been updated to: **${data.status.toUpperCase()}**.`,
        },
        {
          actions: [
            {
              label: "View Consultation",
              url: `/consultations/${data.consultationId}`,
            },
          ],
        },
        { hint: "If you have any questions, please reach out to support." },
      ].filter(Boolean),
    ),
};
