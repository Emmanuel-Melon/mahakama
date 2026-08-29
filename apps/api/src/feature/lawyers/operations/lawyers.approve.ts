import { db } from "@/lib/drizzle";
import { lawyersTable } from "../lawyers.schema";
import { usersSchema } from "@/feature/users/users.schema";
import { eq } from "drizzle-orm";
import type { Lawyer } from "../lawyers.types";
import {
  executeSingle,
  type DbResult,
} from "@/lib/drizzle/results/results.single";

export async function approveLawyer(
  lawyerId: string,
  reviewedBy: string,
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
      reason: `Cannot approve profile in "${existing.status}" status — must be "submitted"`,
      type: "VALIDATION_ERROR",
    };
  }

  return executeSingle(
    db
      .update(lawyersTable)
      .set({
        status: "approved",
        isAvailable: true,
        reviewedBy,
        reviewedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(lawyersTable.id, lawyerId))
      .returning()
      .then(async ([result]) => {
        if (result) {
          await db
            .update(usersSchema)
            .set({ isOnboarded: true, updatedAt: new Date() })
            .where(eq(usersSchema.id, existing.userId));
        }
        return result;
      }),
  );
}
