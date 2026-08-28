import { db } from "@/lib/drizzle";
import { lawyersTable } from "../lawyers.schema";
import { eq, and } from "drizzle-orm";
import type { Lawyer } from "../lawyers.types";
import {
  executeSingle,
  type DbResult,
} from "@/lib/drizzle/results/results.single";

export async function submitLawyerProfile(
  userId: string,
): Promise<DbResult<Lawyer>> {
  const existing = await db.query.lawyers.findFirst({
    where: eq(lawyersTable.userId, userId),
  });

  if (!existing) {
    return {
      ok: false,
      data: null,
      reason: "No lawyer profile found",
      type: "NOT_FOUND",
    };
  }

  if (existing.status !== "draft") {
    return {
      ok: false,
      data: null,
      reason: `Cannot submit profile in "${existing.status}" status — must be "draft"`,
      type: "VALIDATION_ERROR",
    };
  }

  return executeSingle(
    db
      .update(lawyersTable)
      .set({
        status: "submitted",
        submittedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(lawyersTable.userId, userId))
      .returning()
      .then(([result]) => result),
  );
}
