import { z } from "zod";
import { createSelectSchema, createInsertSchema } from "drizzle-zod";
import { lawyersTable } from "./lawyers.schema";
import { LawyerJobs } from "./lawyers.config";
import { baseQuerySchema } from "@/lib/express/express.types";

// ============================================================================
// ZOD SCHEMAS
// ============================================================================

export const createLawyerSchema = createInsertSchema(lawyersTable);
export const lawyerSelectSchema = createSelectSchema(lawyersTable);
export const lawyersListResponseSchema = z.array(lawyerSelectSchema);

export const lawyerQuerySchema = baseQuerySchema.extend({
  specialization: z.string().optional(),
  location: z.string().optional(),
  available: z.preprocess((val) => val === "true", z.boolean()).optional(),
});

// ============================================================================
// DOMAIN TYPES
// ============================================================================

export type NewLawyer = z.infer<typeof createLawyerSchema>;
export type Lawyer = z.infer<typeof lawyerSelectSchema>;
export type LawyerFilters = z.infer<typeof lawyerQuerySchema>;

// ============================================================================
// JOB TYPES
// ============================================================================

export interface LawyersJobMap {
  [LawyerJobs.LawyerOnboarded]: {
    lawyerId: string;
    userId: string;
  };
  [LawyerJobs.LawyerVerified]: {
    lawyerId: string;
    userId: string;
    verifiedBy: string;
  };
}
