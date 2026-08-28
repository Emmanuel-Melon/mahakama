import { v4 as uuid } from "uuid";

import { db } from "@/lib/drizzle";
import {
  executeSingle,
  type DbResult,
} from "@/lib/drizzle/results/results.single";

import { consultationsTable } from "../consultations.schema";
import type { NewConsultation, Consultation } from "../consultations.types";

export async function createConsultation(
  data: NewConsultation,
): Promise<DbResult<Consultation>> {
  return executeSingle(
    db
      .insert(consultationsTable)
      .values({
        id: uuid(),
        customerId: data.customerId,
        lawyerId: data.lawyerId,
        requestMessage: data.requestMessage ?? null,
      })
      .returning()
      .then(([consultation]) => consultation),
  );
}
