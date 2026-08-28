import { eq, inArray } from "drizzle-orm";

import { db } from "@/lib/drizzle";
import { paginate } from "@/lib/drizzle/drizzle.paginate";
import { toManyResult } from "@/lib/drizzle/drizzle.utils";
import { DbManyResult } from "@/lib/drizzle/drizzle.types";
import {
  executeSingle,
  type DbResult,
} from "@/lib/drizzle/results/results.single";

import { consultationsTable } from "../consultations.schema";
import { lawyersTable } from "@/feature/lawyers/lawyers.schema";
import type {
  Consultation,
  ConsultationColumn,
  ConsultationColumnKey,
  ConsultationFilters,
} from "../consultations.types";

export const findConsultation = <K extends ConsultationColumnKey>(
  field: K,
  value: ConsultationColumn[K]["_"]["data"],
): Promise<DbResult<Consultation>> =>
  executeSingle(
    db.query.consultations.findFirst({
      where: eq(consultationsTable[field], value),
    }),
  );

export async function findConsultations(
  query: ConsultationFilters,
): Promise<DbManyResult<Consultation>> {
  const filters = [];

  if (query.status) {
    filters.push(eq(consultationsTable.status, query.status));
  }
  if (query.lawyerId) {
    filters.push(eq(consultationsTable.lawyerId, query.lawyerId));
  }
  if (query.lawyerUserId) {
    filters.push(
      inArray(
        consultationsTable.lawyerId,
        db
          .select({ id: lawyersTable.id })
          .from(lawyersTable)
          .where(eq(lawyersTable.userId, query.lawyerUserId)),
      ),
    );
  }
  if (query.customerId) {
    filters.push(eq(consultationsTable.customerId, query.customerId));
  }

  const result = await paginate<"consultations", Consultation>(
    "consultations",
    consultationsTable,
    {
      ...query,
      filters,
    },
  );

  return toManyResult(result);
}
