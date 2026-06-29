import { db } from "@/lib/drizzle";
import {
  servicesSchema,
  institutionsSchema,
  institutionsToServices,
} from "../services.schema";
import { toResult } from "@/lib/drizzle/drizzle.utils";
import type {
  NewLegalService,
  NewInstitution,
  Institution,
  InstitutionToService,
  LegalService,
} from "../services.types";
import { DbResult } from "@/lib/drizzle/drizzle.types";
import { withDbErrorHandler } from "@/lib/drizzle/drizzle.utils";

export const createService = async (
  data: NewLegalService,
): Promise<DbResult<LegalService>> => {
  return withDbErrorHandler(
    () => db.insert(servicesSchema).values(data).returning(),
    { conflictMessage: `Service with slug '${data.slug}' already exists` },
  );
};

export const createInstitution = async (
  data: NewInstitution,
): Promise<DbResult<Institution>> => {
  return withDbErrorHandler(
    () => db.insert(institutionsSchema).values(data).returning(),
    { conflictMessage: `Institution '${data.name}' is already registered` },
  );
};

export const linkServiceToInstitution = async (
  institutionId: string,
  serviceId: string,
): Promise<DbResult<InstitutionToService>> => {
  const [result] = await db
    .insert(institutionsToServices)
    .values({
      institutionId,
      serviceId,
    })
    .returning();
  return toResult(result);
};
