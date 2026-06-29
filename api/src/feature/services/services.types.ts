import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import {
  institutionsSchema,
  servicesSchema,
  serviceCategoriesSchema,
  institutionsToServices,
} from "./services.schema";
import { baseQuerySchema } from "@/lib/express/express.types";

// ============================================================================
// ZOD SCHEMAS
// ============================================================================

export const serviceSelectSchema = createSelectSchema(servicesSchema).openapi({
  title: "LegalService",
  description: "Legal service response schema",
});

export const serviceInsertSchema = createInsertSchema(servicesSchema).openapi({
  title: "NewService",
  description: "Request schema for creating a new service",
});

export const institutionSelectSchema = createSelectSchema(
  institutionsSchema,
).openapi({
  title: "Institution",
  description: "Institution response schema",
});

export const institutionInsertSchema = createInsertSchema(
  institutionsSchema,
).openapi({
  title: "NewInstitution",
  description: "Request schema for creating a new institution",
});

export const categorySelectSchema = createSelectSchema(
  serviceCategoriesSchema,
).openapi({
  title: "ServiceCategory",
  description: "Service category response schema",
});

export const categoryInsertSchema = createInsertSchema(
  serviceCategoriesSchema,
).openapi({
  title: "NewServiceCategory",
  description: "Request schema for creating a new service category",
});

export const institutionsToServicesSelectSchema = createSelectSchema(
  institutionsToServices,
).openapi({
  title: "InstitutionToService",
  description: "Institution to service relationship response schema",
});

export const institutionsToServicesInsertSchema = createInsertSchema(
  institutionsToServices,
).openapi({
  title: "NewInstitutionToService",
  description:
    "Request schema for creating a new institution to service relationship",
});

// ============================================================================
// DOMAIN TYPES
// ============================================================================

export type LegalService = typeof servicesSchema.$inferSelect;
export type NewLegalService = typeof servicesSchema.$inferInsert;
export type LegalServiceResponse = z.infer<typeof serviceSelectSchema>;

export type Institution = typeof institutionsSchema.$inferSelect;
export type NewInstitution = typeof institutionsSchema.$inferInsert;
export type InstitutionResponse = z.infer<typeof institutionSelectSchema>;

export type ServiceCategory = typeof serviceCategoriesSchema.$inferSelect;
export type NewServiceCategory = typeof serviceCategoriesSchema.$inferInsert;
export type ServiceCategoryResponse = z.infer<typeof categorySelectSchema>;

export type InstitutionToService = typeof institutionsToServices.$inferSelect;
export type NewInstitutionToService =
  typeof institutionsToServices.$inferInsert;
export type InstitutionToServiceResponse = z.infer<
  typeof institutionsToServicesSelectSchema
>;

// ============================================================================
// CONSTANTS
// ============================================================================

export const categoryIcons = {
  government: "Building2",
  "legal-aid": "Scale",
  "dispute-resolution": "HeartHandshake",
  specialized: "Shield",
} as const;

export const categoryLabels = {
  government: "Government",
  "legal-aid": "Legal Aid",
  "dispute-resolution": "Dispute Resolution",
  specialized: "Specialized",
} as const;


export const serviceQuerySchema = baseQuerySchema.extend({
  category: z.string().optional(),
  institution: z.string().optional(),
});

export type ServiceFilters = z.infer<typeof serviceQuerySchema>;

