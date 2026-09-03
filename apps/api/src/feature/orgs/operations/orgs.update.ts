import { db } from "@/lib/drizzle";
import { eq } from "drizzle-orm";
import { orgsTable, orgMembersTable } from "../orgs.schema";
import type {
  UpdateOrg,
  Org,
  UpdateOrgMember,
  OrgMember,
  OrgColumnKey,
  OrgColumn,
  OrgMemberColumnKey,
  OrgMemberColumn,
} from "../orgs.types";
import {
  executeSingle,
  type DbResult,
} from "@/lib/drizzle/results/results.single";

export const updateOrg = async <K extends OrgColumnKey>(
  field: K,
  value: OrgColumn[K]["_"]["data"],
  data: UpdateOrg,
): Promise<DbResult<Org>> => {
  return executeSingle(
    db
      .update(orgsTable)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(orgsTable[field], value))
      .returning()
      .then(([updatedOrg]) => updatedOrg),
  );
};

export const updateOrgMember = async <K extends OrgMemberColumnKey>(
  field: K,
  value: OrgMemberColumn[K]["_"]["data"],
  data: UpdateOrgMember,
): Promise<DbResult<OrgMember>> => {
  return executeSingle(
    db
      .update(orgMembersTable)
      .set(data)
      .where(eq(orgMembersTable[field], value))
      .returning()
      .then(([updatedOrgMember]) => updatedOrgMember),
  );
};