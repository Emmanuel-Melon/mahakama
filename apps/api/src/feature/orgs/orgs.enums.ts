import { pgEnum } from "drizzle-orm/pg-core";

export const orgMemberRoleEnum = pgEnum("org_member_role", [
  "owner",
  "admin",
  "member",
]);

export const orgMemberStatusEnum = pgEnum("org_member_status", [
  "invited",
  "active",
  "removed",
]);

export const matterOwnerTypeEnum = pgEnum("matter_owner_type", [
  "user",
  "org",
]);

export const clientTypeEnum = pgEnum("client_type", ["user", "org"]);

export const clientRelationshipStatusEnum = pgEnum("client_relationship_status", [
  "invited",
  "active",
  "archived",
]);

export const orgClientMemberRoleEnum = pgEnum("org_client_member_role", [
  "primary",
  "secondary",
]);

export const orgClientMemberStatusEnum = pgEnum("org_client_member_status", [
  "invited",
  "active",
  "removed",
]);