import { db } from "@/lib/drizzle";
import { lawyerInvitesTable } from "../lawyers.schema";
import type { LawyerInvite, NewLawyerInvite } from "../lawyers.types";
import {
  executeSingle,
  type DbResult,
} from "@/lib/drizzle/results/results.single";

export async function createLawyerInvite(
  inviteData: NewLawyerInvite,
): Promise<DbResult<LawyerInvite>> {
  const insertData = {
    ...inviteData,
    status: inviteData.status ?? "pending",
  };

  return executeSingle(
    db
      .insert(lawyerInvitesTable)
      .values(insertData)
      .returning()
      .then(([newInvite]) => newInvite),
  );
}
