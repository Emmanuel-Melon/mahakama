import { eq } from "drizzle-orm";

import { db } from "@/lib/drizzle";
import {
  executeSingle,
  type DbResult,
} from "@/lib/drizzle/results/results.single";

import { consultationsTable } from "../consultations.schema";
import type { Consultation } from "../consultations.types";

export async function acceptConsultation(
  consultationId: string,
): Promise<DbResult<Consultation>> {
  return executeSingle(
    db
      .update(consultationsTable)
      .set({
        status: "accepted",
        respondedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(consultationsTable.id, consultationId))
      .returning()
      .then(([consultation]) => consultation),
  );
}

export async function declineConsultation(
  consultationId: string,
  declineReason: string,
): Promise<DbResult<Consultation>> {
  return executeSingle(
    db
      .update(consultationsTable)
      .set({
        status: "declined",
        declineReason,
        respondedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(consultationsTable.id, consultationId))
      .returning()
      .then(([consultation]) => consultation),
  );
}

export async function engageConsultation(
  consultationId: string,
): Promise<DbResult<Consultation>> {
  return executeSingle(
    db
      .update(consultationsTable)
      .set({
        status: "engaged",
        engagedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(consultationsTable.id, consultationId))
      .returning()
      .then(([consultation]) => consultation),
  );
}

export async function closeConsultation(
  consultationId: string,
): Promise<DbResult<Consultation>> {
  return executeSingle(
    db
      .update(consultationsTable)
      .set({
        status: "closed",
        closedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(consultationsTable.id, consultationId))
      .returning()
      .then(([consultation]) => consultation),
  );
}
