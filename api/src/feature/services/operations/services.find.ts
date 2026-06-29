import { db } from "@/lib/drizzle";
import { eq } from "drizzle-orm";
import { servicesSchema, institutionsSchema } from "../services.schema";
import { toSingleResult, toManyResult } from "@/lib/drizzle/drizzle.utils";
import { DbSingleResult, DbManyResult } from "@/lib/drizzle/drizzle.types";
import type { LegalService, Institution, ServiceFilters } from "../services.types";
import { paginate } from "@/lib/drizzle/drizzle.paginate";

export const findServiceBySlug = async (
  slug: string,
): Promise<DbSingleResult<LegalService>> => {
  const result = await db.query.servicesSchema.findFirst({
    where: eq(servicesSchema.slug, slug),
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

export const findInstitutionById = async (
  id: string,
): Promise<DbSingleResult<Institution>> => {
  const result = await db.query.institutionsSchema.findFirst({
    where: eq(institutionsSchema.id, id),
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

export const findServices = async (query: ServiceFilters): Promise<
  DbManyResult<LegalService>
> => {
  const filters = [];

  if(query.q) {
    filters.push(eq(servicesSchema.name, query.q));
  }

  const result = await paginate<"servicesSchema", LegalService>("servicesSchema", servicesSchema, {
    ...query,
    filters,
  });
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
