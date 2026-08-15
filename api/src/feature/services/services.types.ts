import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import {
  institutionsSchema,
  servicesSchema,
  serviceCategoriesSchema,
  institutionsToServices,
} from "./services.schema";
import { baseQuerySchema } from "@/lib/express/express.types";
import { crudMeta } from "@/lib/openapi/openapi.utils";

/*
 * DRIZZLE-GENERATED SCHEMAS (from PostgreSQL tables)
 */

const baseServiceInsert = createInsertSchema(servicesSchema);
const baseServiceSelect = createSelectSchema(servicesSchema);

export const serviceSelectSchema = crudMeta(
  baseServiceSelect,
  "select",
  "LegalService",
);

export const serviceInsertSchema = crudMeta(
  baseServiceInsert,
  "insert",
  "LegalService",
);

const baseInstitutionInsert = createInsertSchema(institutionsSchema);
const baseInstitutionSelect = createSelectSchema(institutionsSchema);

export const institutionSelectSchema = crudMeta(
  baseInstitutionSelect,
  "select",
  "Institution",
);

export const institutionInsertSchema = crudMeta(
  baseInstitutionInsert,
  "insert",
  "Institution",
);

const baseCategoryInsert = createInsertSchema(serviceCategoriesSchema);
const baseCategorySelect = createSelectSchema(serviceCategoriesSchema);

export const categorySelectSchema = crudMeta(
  baseCategorySelect,
  "select",
  "ServiceCategory",
);

export const categoryInsertSchema = crudMeta(
  baseCategoryInsert,
  "insert",
  "ServiceCategory",
);

const baseInstitutionsToServicesInsert = createInsertSchema(
  institutionsToServices,
);
const baseInstitutionsToServicesSelect = createSelectSchema(
  institutionsToServices,
);

export const institutionsToServicesSelectSchema = crudMeta(
  baseInstitutionsToServicesSelect,
  "select",
  "InstitutionToService",
);

export const institutionsToServicesInsertSchema = crudMeta(
  baseInstitutionsToServicesInsert,
  "insert",
  "InstitutionToService",
);

export const serviceQuerySchema = baseQuerySchema.extend({
  category: z.string().optional(),
  institution: z.string().optional(),
});

/*
 * DOMAIN-RELATED TYPES
 */

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

export type ServiceFilters = z.infer<typeof serviceQuerySchema>;

/*
 * DATABASE QUERY TYPES
 */
export type ServiceColumn = typeof servicesSchema._.columns;
export type ServiceColumnKey = keyof ServiceColumn;

export type InstitutionColumn = typeof institutionsSchema._.columns;
export type InstitutionColumnKey = keyof InstitutionColumn;

export type ServiceCategoryColumn = typeof serviceCategoriesSchema._.columns;
export type ServiceCategoryColumnKey = keyof ServiceCategoryColumn;

/*
 * CONSTANTS
 */

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
