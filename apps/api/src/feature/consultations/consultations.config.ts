import { JsonApiResourceConfig } from "@/lib/express/express.types";
import { type Consultation } from "./consultations.types";

export const SerializedConsultation: JsonApiResourceConfig<Consultation> = {
  type: "consultation",
  attributes: (consultation: Consultation) => consultation,
};

export const ConsultationJobs = {
  ConsultationRequested: "consultation.requested",
  ConsultationAccepted: "consultation.accepted",
  ConsultationDeclined: "consultation.declined",
  ConsultationEngaged: "consultation.engaged",
} as const;

export type ConsultationsJobType =
  (typeof ConsultationJobs)[keyof typeof ConsultationJobs];

export const sortableFields = ["createdAt", "updatedAt", "status"] as const;

export const searchableFields = ["requestMessage"] as const;
export type SearchableField = (typeof searchableFields)[number];
export type SortableField = (typeof sortableFields)[number];

export const ConsultationNotificationTemplates = {
  CONSULTATION_REQUESTED: {
    key: "consultation_requested",
    _data: {} as {
      consultationId: string;
      lawyerId: string;
      customerName?: string;
    },
  },
  CONSULTATION_ACCEPTED: {
    key: "consultation_accepted",
    _data: {} as {
      consultationId: string;
      customerId: string;
      lawyerName?: string;
    },
  },
  CONSULTATION_DECLINED: {
    key: "consultation_declined",
    _data: {} as {
      consultationId: string;
      customerId: string;
      declineReason: string;
    },
  },
} as const;
