import { db } from "@/lib/drizzle";
import {
  servicesSchema,
  institutionsSchema,
  institutionsToServices,
} from "../services.schema";
import {
  executeSingle,
  type DbResult,
} from "@/lib/drizzle/results/results.single";
import type {
  NewLegalService,
  NewInstitution,
  Institution,
  InstitutionToService,
  LegalService,
} from "../services.types";

export const createService = async (
  data: NewLegalService,
): Promise<DbResult<LegalService>> => {
  return executeSingle(
    db
      .insert(servicesSchema)
      .values(data)
      .returning()
      .then(([result]) => result),
  );
};

export const createInstitution = async (
  data: NewInstitution,
): Promise<DbResult<Institution>> => {
  return executeSingle(
    db
      .insert(institutionsSchema)
      .values(data)
      .returning()
      .then(([result]) => result),
  );
};

export const linkServiceToInstitution = async (
  institutionId: string,
  serviceId: string,
): Promise<DbResult<InstitutionToService>> => {
  return executeSingle(
    db
      .insert(institutionsToServices)
      .values({
        institutionId,
        serviceId,
      })
      .returning()
      .then(([result]) => result),
  );
};
