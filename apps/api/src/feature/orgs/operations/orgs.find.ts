import { db } from "@/lib/drizzle";
import { eq, and, inArray } from "drizzle-orm";
import { orgsTable, orgMembersTable } from "../orgs.schema";
import type {
  OrgWithRelations,
  Org,
  OrgMember,
  OrgsFilters,
  OrgMembersFilters,
  OrgColumnKey,
  OrgColumn,
} from "../orgs.types";
import {
  executeSingle,
  type DbResult,
} from "@/lib/drizzle/results/results.single";
import { toManyResult } from "@/lib/drizzle/drizzle.utils";
import { DbManyResult } from "@/lib/drizzle/drizzle.types";
import { paginate } from "@/lib/drizzle/drizzle.paginate";

export const findOrgs = async (
  query: OrgsFilters,
): Promise<DbManyResult<Org>> => {
  const filters = [];

  if (query.userId) {
    filters.push(
      inArray(
        orgsTable.id,
        db
          .select({ orgId: orgMembersTable.orgId })
          .from(orgMembersTable)
          .where(eq(orgMembersTable.userId, query.userId)),
      ),
    );
  }
  if (query.name) {
    filters.push(eq(orgsTable.name, query.name));
  }
  if (query.slug) {
    filters.push(eq(orgsTable.slug, query.slug));
  }

  const result = await paginate<"orgs", Org>(
    "orgs",
    orgsTable,
    {
      ...query,
      filters,
      search: {
        q: query.q,
        columns: [orgsTable.name, orgsTable.slug],
      },
    },
  );
  return toManyResult(result);
};

export const findOrg = async <K extends OrgColumnKey>(
  field: K,
  value: OrgColumn[K]["_"]["data"],
): Promise<DbResult<OrgWithRelations>> => {
  return executeSingle(
    db.query.orgs.findFirst({
      where: eq(orgsTable[field], value),
      with: {
        members: true,
      },
    }),
  );
};

export const findOrgMembers = async (
  orgId: string,
  query: OrgMembersFilters,
): Promise<DbManyResult<OrgMember>> => {
  const filters = [eq(orgMembersTable.orgId, orgId)];

  if (query.role) {
    filters.push(eq(orgMembersTable.role, query.role));
  }
  if (query.status) {
    filters.push(eq(orgMembersTable.status, query.status));
  }

  const result = await paginate<"org_members", OrgMember>(
    "org_members",
    orgMembersTable,
    {
      ...query,
      filters,
    },
  );
  return toManyResult(result);
};

export const findOrgMember = async (
  orgId: string,
  userId: string,
): Promise<DbResult<OrgMember>> => {
  return executeSingle(
    db.query.orgMembers.findFirst({
      where: and(
        eq(orgMembersTable.orgId, orgId),
        eq(orgMembersTable.userId, userId),
      ),
    }),
  );
};