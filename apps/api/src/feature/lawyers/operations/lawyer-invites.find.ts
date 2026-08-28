import { db } from "@/lib/drizzle";
import { lawyerInvitesTable } from "../lawyers.schema";
import { eq } from "drizzle-orm";
import type {
  LawyerInvite,
  LawyerInviteColumn,
  LawyerInviteColumnKey,
} from "../lawyers.types";
import {
  executeSingle,
  type DbResult,
} from "@/lib/drizzle/results/results.single";

export const findLawyerInvite = async <K extends LawyerInviteColumnKey>(
  field: K,
  value: LawyerInviteColumn[K]["_"]["data"],
): Promise<DbResult<LawyerInvite>> => {
  return executeSingle(
    db.query.lawyerInvites.findFirst({
      where: eq(lawyerInvitesTable[field], value),
    }),
  );
};
