import { z } from "zod";
import { createSelectSchema, createInsertSchema } from "drizzle-zod";
import { orgsTable, orgMembersTable } from "./orgs.schema";
import { baseQuerySchema } from "@/lib/express/express.types";
import { crudMeta } from "@/lib/openapi/openapi.utils";
import { OrgJobs } from "./orgs.config";

/*
 * DRIZZLE-GENERATED SCHEMAS (from PostgreSQL tables)
 */

// Orgs
const baseOrgInsert = createInsertSchema(orgsTable);
const baseOrgSelect = createSelectSchema(orgsTable);

export const orgSelectSchema = crudMeta(
  baseOrgSelect,
  "select",
  "Org",
);
export const orgInsertSchema = crudMeta(
  baseOrgInsert,
  "insert",
  "Org",
);
export const orgUpdateSchema = crudMeta(
  baseOrgInsert
    .omit({ id: true, createdByUserId: true, createdAt: true })
    .partial(),
  "update",
  "Org",
);

export const orgsQuerySchema = baseQuerySchema.extend({
  name: z.string().optional(),
  slug: z.string().optional(),
  userId: z.string().optional(),
});

export const orgMembersQuerySchema = baseQuerySchema.extend({
  orgId: z.string().optional(),
  role: z.string().optional(),
  status: z.string().optional(),
});

// Org Members
const baseOrgMemberInsert = createInsertSchema(orgMembersTable);
const baseOrgMemberSelect = createSelectSchema(orgMembersTable);

export const orgMemberSelectSchema = crudMeta(
  baseOrgMemberSelect,
  "select",
  "OrgMember",
);
export const orgMemberInsertSchema = crudMeta(
  baseOrgMemberInsert,
  "insert",
  "OrgMember",
);
export const orgMemberUpdateSchema = crudMeta(
  baseOrgMemberInsert
    .omit({ id: true, orgId: true, userId: true, invitedAt: true })
    .partial()
    .extend({
      joinedAt: z.coerce.date().nullable().optional(),
    }),
  "update",
  "OrgMember",
);

/*
 * DOMAIN-RELATED TYPES
 */

export type Org = z.infer<typeof orgSelectSchema>;
export type NewOrg = z.infer<typeof orgInsertSchema>;
export type UpdateOrg = z.infer<typeof orgUpdateSchema>;
export type OrgAttrs = z.infer<typeof orgsTable>;
export type OrgResponse = z.infer<typeof orgSelectSchema>;
export type OrgsFilters = z.infer<typeof orgsQuerySchema>;
export type OrgMembersFilters = z.infer<typeof orgMembersQuerySchema>;

export type OrgMember = z.infer<typeof orgMemberSelectSchema>;
export type NewOrgMember = z.infer<typeof orgMemberInsertSchema>;
export type UpdateOrgMember = z.infer<typeof orgMemberUpdateSchema>;
export type OrgMemberAttrs = z.infer<typeof orgMembersTable>;

export type OrgWithRelations = Org & {
  members?: OrgMember[];
};

/*
 * DATABASE QUERY TYPES
 */

export type OrgColumn = typeof orgsTable._.columns;
export type OrgColumnKey = keyof OrgColumn;

export type OrgMemberColumn = typeof orgMembersTable._.columns;
export type OrgMemberColumnKey = keyof OrgMemberColumn;

/*
 * QUEUE-RELATED TYPES
 */

export const OrgMemberInvitedPayloadSchema = z.object({
  orgId: z.string(),
  userId: z.string(),
  invitedByUserId: z.string().optional(),
});

export const OrgMemberStatusChangedPayloadSchema = z.object({
  orgId: z.string(),
  userId: z.string(),
  status: z.string(),
});

export type OrgMemberInvitedPayload = z.infer<typeof OrgMemberInvitedPayloadSchema>;
export type OrgMemberStatusChangedPayload = z.infer<typeof OrgMemberStatusChangedPayloadSchema>;

export interface OrgJobMap {
  [OrgJobs.OrgMemberInvited]: OrgMemberInvitedPayload;
  [OrgJobs.OrgMemberStatusChanged]: OrgMemberStatusChangedPayload;
}

/*
 * API PARAMETER TYPES
 */

export interface ListOrgsParams {
  userId?: string;
  limit?: number;
  offset?: number;
}

export interface ListOrgMembersParams {
  orgId?: string;
  role?: string;
  status?: string;
  limit?: number;
  offset?: number;
}

export type DeleteOrgOptions = {
  userId?: string;
};

/*
 * RESPONSE TYPES
 */

export interface OrgListEntry extends Omit<Org, "createdByUserId"> {
  memberCount: number;
}