import { db } from "@/lib/drizzle";
import { and, eq } from "drizzle-orm";
import { orgMembersTable } from "../orgs.schema";
import type { OrgMember } from "../orgs.types";
import {
  executeSingle,
  type DbResult,
} from "@/lib/drizzle/results/results.single";

export const deleteOrgMember = async (
  orgId: string,
  userId: string,
): Promise<DbResult<OrgMember>> => {
  return executeSingle(
    db
      .delete(orgMembersTable)
      .where(
        and(
          eq(orgMembersTable.orgId, orgId),
          eq(orgMembersTable.userId, userId),
        ),
      )
      .returning()
      .then(([deleted]) => deleted),
  );
};
