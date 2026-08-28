import { db } from "@/lib/drizzle";
import { lawyerInvitesTable } from "../lawyers.schema";
import { eq } from "drizzle-orm";
import type { LawyerInvite, UpdateLawyerInvite } from "../lawyers.types";
import {
  executeSingle,
  type DbResult,
} from "@/lib/drizzle/results/results.single";

export const updateLawyerInvite = async (
  id: string,
  updateData: UpdateLawyerInvite,
): Promise<DbResult<LawyerInvite>> => {
  return executeSingle(
    db
      .update(lawyerInvitesTable)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(lawyerInvitesTable.id, id))
      .returning()
      .then(([result]) => result),
  );
};
