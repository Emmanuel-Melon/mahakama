import { db } from "@/lib/drizzle";
import { orgsTable, orgMembersTable } from "../orgs.schema";
import type {
  NewOrg,
  Org,
  NewOrgMember,
  OrgMember,
} from "../orgs.types";
import {
  executeSingle,
  type DbResult,
} from "@/lib/drizzle/results/results.single";

export const insertOrg = async (
  params: NewOrg,
): Promise<DbResult<Org>> => {
  return executeSingle(
    db
      .insert(orgsTable)
      .values({
        ...params,
        name: params.name || "New Org",
      })
      .returning()
      .then(([newOrg]) => newOrg),
  );
};

export const insertOrgMember = async (
  params: NewOrgMember,
): Promise<DbResult<OrgMember>> => {
  return executeSingle(
    db
      .insert(orgMembersTable)
      .values(params)
      .returning()
      .then(([newOrgMember]) => newOrgMember),
  );
};