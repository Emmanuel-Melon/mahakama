import { z } from "zod";
import { createSelectSchema, createInsertSchema } from "drizzle-zod";
import { lawyersTable } from "./lawyers.schema";
import { LawyerJobs } from "./lawyers.config";
import { baseQuerySchema } from "@/lib/express/express.types";
import { crudMeta } from "@/lib/openapi/openapi.utils";

/*
 * DRIZZLE-GENERATED SCHEMAS (from PostgreSQL tables)
 */

const baseInsert = createInsertSchema(lawyersTable);
const baseSelect = createSelectSchema(lawyersTable);

export const createLawyerSchema = crudMeta(baseInsert, "insert", "Lawyer");

export const lawyerSelectSchema = crudMeta(baseSelect, "select", "Lawyer");

export const lawyersUpdateSchema = crudMeta(
  baseInsert.omit({ id: true, createdAt: true }).partial(),
  "update",
  "Lawyer",
);

export const lawyersListResponseSchema = z.array(lawyerSelectSchema);

export const lawyerQuerySchema = baseQuerySchema.extend({
  specialization: z.string().optional(),
  location: z.string().optional(),
  available: z.preprocess((val) => val === "true", z.boolean()).optional(),
});

/*
 * DOMAIN-RELATED TYPES
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
