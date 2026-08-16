import { db } from "@/lib/drizzle";
import { eq } from "drizzle-orm";
import { servicesSchema, institutionsSchema } from "../services.schema";
import { toSingleResult, toManyResult } from "@/lib/drizzle/drizzle.utils";
import { DbSingleResult, DbManyResult } from "@/lib/drizzle/drizzle.types";
import type {
  LegalService,
  Institution,
  ServiceFilters,
  InstitutionColumn,
  InstitutionColumnKey,
  ServiceColumn,
  ServiceColumnKey,
} from "../services.types";
import { paginate } from "@/lib/drizzle/drizzle.paginate";

export const findService = async <K extends ServiceColumnKey>(
  field: K,
  value: ServiceColumn[K]["_"]["data"],
): Promise<DbSingleResult<LegalService>> => {
  const result = await db.query.servicesSchema.findFirst({
    where: eq(servicesSchema[field], value),
    with: {
      institutions: {
        with: {
          institution: true,
        },
      },
    },
  });
  return toSingleResult(result);
};

export const findInstitution = async <K extends InstitutionColumnKey>(
  field: K,
  value: InstitutionColumn[K]["_"]["data"],
): Promise<DbSingleResult<Institution>> => {
  const result = await db.query.institutionsSchema.findFirst({
    where: eq(institutionsSchema[field], value),
    with: {
      services: {
        with: {
          service: true,
        },
      },
    },
  });
  return toSingleResult(result);
};

export const findServices = async (
  query: ServiceFilters,
): Promise<DbManyResult<LegalService>> => {
  const filters = [];

  if (query.q) {
    filters.push(eq(servicesSchema.name, query.q));
  }

  const result = await paginate<"servicesSchema", LegalService>(
    "servicesSchema",
    servicesSchema,
    {
      ...query,
      filters,
      defaultSort: servicesSchema.createdAt,
    },
  );
  return toManyResult(result);
};

export const findAllInstitutions = async (): Promise<
  DbManyResult<Institution>
> => {
  const result = await db.query.institutionsSchema.findMany({
    with: {
      services: {
        with: {
          service: true,
        },
      },
    },
  });
  return toManyResult(result);
};
