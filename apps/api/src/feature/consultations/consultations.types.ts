import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { createSelectSchema, createInsertSchema } from "drizzle-zod";
import { consultationsTable } from "./consultations.schema";
import { ConsultationJobs } from "./consultations.config";
import { baseQuerySchema } from "@/lib/express/express.types";
import { crudMeta } from "@/lib/openapi/openapi.utils";
import { NotificationTrackingSchema } from "../notifications/notifications.types";

extendZodWithOpenApi(z);

/*
 * DRIZZLE-GENERATED SCHEMAS (from PostgreSQL tables)
 */

export const insertConsultationSchema = createInsertSchema(consultationsTable);
const baseConsultationSelect = createSelectSchema(consultationsTable);

export const consultationSelectSchema = crudMeta(
  baseConsultationSelect,
  "select",
  "Consultation",
);

/*
 * ACTION SCHEMAS
 *
 * Deliberately no generic "update" schema — status transitions go through
 * these explicit action endpoints (request/accept/decline/engage/close)
 * rather than a free-form PATCH, since each transition has different
 * required fields and side effects (jobs, notifications).
 */

export const createConsultationSchema = crudMeta(
  insertConsultationSchema.omit({
    id: true,
    customerId: true, // derived from authenticated user, not client-supplied
    status: true,
    respondedAt: true,
    declineReason: true,
    engagedAt: true,
    closedAt: true,
    createdAt: true,
    updatedAt: true,
  }),
  "insert",
  "Consultation",
);

export const acceptConsultationSchema = z.object({});

export const declineConsultationSchema = z.object({
  declineReason: z.string().min(1, "Decline reason is required"),
});

export const engageConsultationSchema = z.object({});

export const closeConsultationSchema = z.object({});

/*
 * QUERY / RESPONSE SCHEMAS
 */

export const consultationsListResponseSchema = z.array(
  consultationSelectSchema,
);

export const consultationQuerySchema = baseQuerySchema.extend({
  status: z.string().optional(),
  lawyerId: z.string().optional(),
  lawyerUserId: z.string().optional(), // resolves to lawyerId via lawyersTable.userId
  customerId: z.string().optional(),
});

/*
 * CONSULTATION TYPES
 */

export type NewConsultation = z.infer<typeof insertConsultationSchema>;
export type Consultation = z.infer<typeof consultationSelectSchema>;
export type CreateConsultation = z.infer<typeof createConsultationSchema>;
export type DeclineConsultation = z.infer<typeof declineConsultationSchema>;
export type ConsultationFilters = z.infer<typeof consultationQuerySchema>;

/*
 * DATABASE QUERY TYPES
 */

export type ConsultationColumn = typeof consultationsTable._.columns;
export type ConsultationColumnKey = keyof ConsultationColumn;

/*
 * QUEUE-RELATED TYPES
 */

export const ConsultationRequestedPayloadSchema = z.object({
  consultationId: z.string(),
  customerId: z.string(),
  lawyerId: z.string(),
});

export const ConsultationAcceptedPayloadSchema = z.object({
  consultationId: z.string(),
  customerId: z.string(),
  lawyerId: z.string(),
});

export const ConsultationDeclinedPayloadSchema = z.object({
  consultationId: z.string(),
  customerId: z.string(),
  lawyerId: z.string(),
  declineReason: z.string(),
});

export const ConsultationEngagedPayloadSchema = z.object({
  consultationId: z.string(),
  customerId: z.string(),
  lawyerId: z.string(),
});

export type ConsultationRequestedPayload = z.infer<
  typeof ConsultationRequestedPayloadSchema
>;
export type ConsultationAcceptedPayload = z.infer<
  typeof ConsultationAcceptedPayloadSchema
>;
export type ConsultationDeclinedPayload = z.infer<
  typeof ConsultationDeclinedPayloadSchema
>;
export type ConsultationEngagedPayload = z.infer<
  typeof ConsultationEngagedPayloadSchema
>;

export interface ConsultationsJobMap {
  [ConsultationJobs.ConsultationRequested]: ConsultationRequestedPayload;
  [ConsultationJobs.ConsultationAccepted]: ConsultationAcceptedPayload;
  [ConsultationJobs.ConsultationDeclined]: ConsultationDeclinedPayload;
  [ConsultationJobs.ConsultationEngaged]: ConsultationEngagedPayload;
}

/*
 * NOTIFICATION-RELATED TYPES (for notification system integration)
 */

export const ConsultationNotificationBaseSchema =
  NotificationTrackingSchema.extend({
    consultationId: z.string().uuid(),
    customerName: z.string(),
    lawyerName: z.string(),
  });

export const ConsultationRequestedNotificationSchema =
  ConsultationNotificationBaseSchema.extend({
    requestMessage: z.string().optional(),
  });

export const ConsultationStatusChangedNotificationSchema =
  ConsultationNotificationBaseSchema.extend({
    status: z.enum(["pending", "accepted", "declined", "engaged", "closed"]),
    declineReason: z.string().optional(),
  });

export type ConsultationRequestedNotification = z.infer<
  typeof ConsultationRequestedNotificationSchema
>;
export type ConsultationStatusChangedNotification = z.infer<
  typeof ConsultationStatusChangedNotificationSchema
>;
