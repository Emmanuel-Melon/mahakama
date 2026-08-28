import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { createSelectSchema, createInsertSchema } from "drizzle-zod";
import {
  lawyerInvitesTable,
  lawyerProfileDocumentsTable,
  lawyersTable,
} from "./lawyers.schema";
import { LawyerJobs } from "./lawyers.config";
import { baseQuerySchema } from "@/lib/express/express.types";
import { crudMeta } from "@/lib/openapi/openapi.utils";

extendZodWithOpenApi(z);

/*
 * DRIZZLE-GENERATED SCHEMAS (from PostgreSQL tables)
 */

export const createLawyerSchema = createInsertSchema(lawyersTable);
const baseLawyerSelect = createSelectSchema(lawyersTable);

export const lawyerSelectSchema = crudMeta(
  baseLawyerSelect,
  "select",
  "Lawyer",
);

export const lawyersUpdateSchema = crudMeta(
  createLawyerSchema
    .omit({
      id: true,
      createdAt: true,
    })
    .partial(),
  "update",
  "Lawyer",
);

/*
 * INVITE SCHEMAS
 */

export const insertLawyerInviteSchema = createInsertSchema(lawyerInvitesTable);
export const selectLawyerInviteSchema = createSelectSchema(lawyerInvitesTable);
export const updateLawyerInviteSchema = insertLawyerInviteSchema
  .omit({
    id: true,
    token: true,
    invitedBy: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial();

/*
 * PROFILE DOCUMENT SCHEMAS
 */

export const insertLawyerProfileDocumentSchema = createInsertSchema(
  lawyerProfileDocumentsTable,
);
export const selectLawyerProfileDocumentSchema = createSelectSchema(
  lawyerProfileDocumentsTable,
);

/*
 * ACTION SCHEMAS
 */

export const rejectLawyerSchema = z.object({
  rejectionReason: z.string().min(1, "Rejection reason is required"),
});

export const approveLawyerSchema = z.object({});

export const createLawyerInviteSchema = crudMeta(
  insertLawyerInviteSchema.omit({
    id: true,
    token: true,
    invitedBy: true,
    createdAt: true,
    updatedAt: true,
    status: true,
    acceptedAt: true,
  }),
  "insert",
  "LawyerInvite",
);

/*
 * QUERY / RESPONSE SCHEMAS
 */

export const lawyersListResponseSchema = z.array(lawyerSelectSchema);

export const lawyerQuerySchema = baseQuerySchema.extend({
  specialization: z.string().optional(),
  location: z.string().optional(),
  status: z.string().optional(),
  userId: z.string().optional(),
  available: z.preprocess((val) => val === "true", z.boolean()).optional(),
});

/*
 * LAWYER TYPES
 */

export type NewLawyer = z.infer<typeof createLawyerSchema>;
export type Lawyer = z.infer<typeof lawyerSelectSchema>;
export type UpdateLawyer = z.infer<typeof lawyersUpdateSchema>;
export type LawyerFilters = z.infer<typeof lawyerQuerySchema>;

/*
 * DATABASE QUERY TYPES
 */
export type LawyerColumn = typeof lawyersTable._.columns;
export type LawyerColumnKey = keyof LawyerColumn;

/*
 * INVITE TYPES
 */

export type NewLawyerInvite = z.infer<typeof insertLawyerInviteSchema>;
export type LawyerInvite = z.infer<typeof selectLawyerInviteSchema>;
export type UpdateLawyerInvite = z.infer<typeof updateLawyerInviteSchema>;

export type LawyerInviteColumn = typeof lawyerInvitesTable._.columns;
export type LawyerInviteColumnKey = keyof LawyerInviteColumn;

/*
 * PROFILE DOCUMENT TYPES
 */

export type NewLawyerProfileDocument = z.infer<
  typeof insertLawyerProfileDocumentSchema
>;
export type LawyerProfileDocument = z.infer<
  typeof selectLawyerProfileDocumentSchema
>;

/*
 * QUEUE-RELATED TYPES
 */

export const LawyerOnboardedPayloadSchema = z.object({
  lawyerId: z.string(),
  userId: z.string(),
});

export const LawyerVerifiedPayloadSchema = z.object({
  lawyerId: z.string(),
  userId: z.string(),
  verifiedBy: z.string(),
});

export type LawyerOnboardedPayload = z.infer<
  typeof LawyerOnboardedPayloadSchema
>;
export type LawyerVerifiedPayload = z.infer<typeof LawyerVerifiedPayloadSchema>;

export interface LawyersJobMap {
  [LawyerJobs.LawyerOnboarded]: LawyerOnboardedPayload;
  [LawyerJobs.LawyerVerified]: LawyerVerifiedPayload;
}
