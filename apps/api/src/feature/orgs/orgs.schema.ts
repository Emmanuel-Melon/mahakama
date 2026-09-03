import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  unique,
  integer,
  text,
  boolean,
} from "drizzle-orm/pg-core";
import { usersSchema } from "@/feature/users/users.schema";
import { lawyersTable } from "@/feature/lawyers/lawyers.schema";
import { clientRelationshipStatusEnum, clientTypeEnum, orgClientMemberRoleEnum, orgClientMemberStatusEnum, orgMemberRoleEnum, orgMemberStatusEnum } from "./orgs.enums";
import { mattersTable } from "../matter/matter.schema";

export const orgsTable = pgTable("orgs", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  createdByUserId: uuid("created_by_user_id")
    .notNull()
    .references(() => usersSchema.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Team membership — reused for both "firm" orgs (lawyerId set) and
// "client" orgs (lawyerId null, member is just a company rep).
export const orgMembersTable = pgTable(
  "org_members",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orgId: uuid("org_id")
      .notNull()
      .references(() => orgsTable.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => usersSchema.id),
    lawyerId: uuid("lawyer_id").references(() => lawyersTable.id), // set when this member is a practicing lawyer on the team
    role: orgMemberRoleEnum("role").default("member").notNull(),
    status: orgMemberStatusEnum("status").default("invited").notNull(),
    invitedAt: timestamp("invited_at").defaultNow().notNull(),
    joinedAt: timestamp("joined_at"),
  },
  (t) => ({
    uniqueMembership: unique().on(t.orgId, t.userId),
  }),
);

export const orgClientsTable = pgTable(
  "org_clients",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orgId: uuid("org_id") // the representing org (law firm)
      .notNull()
      .references(() => orgsTable.id, { onDelete: "cascade" }),
    clientType: clientTypeEnum("client_type").notNull(),
    clientUserId: uuid("client_user_id").references(() => usersSchema.id),
    clientOrgId: uuid("client_org_id").references(() => orgsTable.id), // the business, itself just an org
    status: clientRelationshipStatusEnum("status").default("invited").notNull(),
    createdByUserId: uuid("created_by_user_id")
      .notNull()
      .references(() => usersSchema.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => ({
    uniqueUserClient: unique().on(t.orgId, t.clientUserId),
    uniqueOrgClient: unique().on(t.orgId, t.clientOrgId),
  }),
);

export const clientDocumentsTable = pgTable("client_documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  orgClientId: uuid("org_client_id")
    .notNull()
    .references(() => orgClientsTable.id, { onDelete: "cascade" }),
  matterId: uuid("matter_id").references(() => mattersTable.id, {
    onDelete: "set null",
  }), // optional — tag a document to a specific matter without requiring one
  uploadedByUserId: uuid("uploaded_by_user_id")
    .notNull()
    .references(() => usersSchema.id),
  fileName: varchar("file_name", { length: 255 }).notNull(),
  fileUrl: varchar("file_url", { length: 1024 }).notNull(),
  fileType: varchar("file_type", { length: 100 }),
  fileSize: integer("file_size"),
  description: text("description"),
  isInternal: boolean("is_internal").default(false).notNull(), // firm-only, hidden from client — same convention as matterNotesTable/matterActivitiesTable
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orgClientMembersTable = pgTable(
  "org_client_members",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orgClientId: uuid("org_client_id")
      .notNull()
      .references(() => orgClientsTable.id, { onDelete: "cascade" }),
    lawyerId: uuid("lawyer_id")
      .notNull()
      .references(() => lawyersTable.id, { onDelete: "cascade" }),
    role: orgClientMemberRoleEnum("role").default("secondary").notNull(),
    status: orgClientMemberStatusEnum("status").default("invited").notNull(),
    addedByUserId: uuid("added_by_user_id")
      .notNull()
      .references(() => usersSchema.id),
    invitedAt: timestamp("invited_at").defaultNow().notNull(),
    acceptedAt: timestamp("accepted_at"),
  },
  (t) => ({
    uniqueStaffing: unique().on(t.orgClientId, t.lawyerId),
  }),
);

export const combinedOrgSchema = {
  orgs: orgsTable,
  orgMembers: orgMembersTable,
  orgClients: orgClientsTable,
  clientDocuments: clientDocumentsTable,
  orgClientMembers: orgClientMembersTable,
};