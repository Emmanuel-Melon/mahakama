import { db } from "@/lib/drizzle";
import { lawyersTable } from "../lawyers.schema";
import { eq } from "drizzle-orm";
import type { Lawyer } from "../lawyers.types";
import {
  executeSingle,
  type DbResult,
} from "@/lib/drizzle/results/results.single";

export async function rejectLawyer(
  lawyerId: string,
  reviewedBy: string,
  rejectionReason: string,
): Promise<DbResult<Lawyer>> {
  const existing = await db.query.lawyers.findFirst({
    where: eq(lawyersTable.id, lawyerId),
  });

  if (!existing) {
    return {
      ok: false,
      data: null,
      reason: "Lawyer not found",
      type: "NOT_FOUND",
    };
  }

  if (existing.status !== "submitted") {
    return {
      ok: false,
      data: null,
      reason: `Cannot reject profile in "${existing.status}" status — must be "submitted"`,
      type: "VALIDATION_ERROR",
    };
  }

  if (!rejectionReason?.trim()) {
    return {
      ok: false,
      data: null,
      reason: "Rejection reason is required",
      type: "VALIDATION_ERROR",
    };
  }

  return executeSingle(
    db
      .update(lawyersTable)
      .set({
        status: "rejected",
        rejectionReason: rejectionReason.trim(),
        reviewedBy,
        reviewedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(lawyersTable.id, lawyerId))
      .returning()
      .then(([result]) => result),
  );
}
