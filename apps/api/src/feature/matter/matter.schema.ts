import {
  pgTable,
  uuid,
  text,
  varchar,
  timestamp,
  jsonb,
  boolean,
  integer,
} from "drizzle-orm/pg-core";
import { usersSchema } from "@/feature/users/users.schema";
import { chatsSchema } from "@/feature/chats/chats.schema";
import { lawyersTable } from "@/feature/lawyers/lawyers.schema";
import {
  matterStatusEnum,
  matterLawyerRoleEnum,
  matterEventTypeEnum,
  matterActivityTypeEnum,
  matterCreatorTypeEnum,
  matterOwnerTypeEnum,
} from "./matter.enums";
import { orgsTable } from "../orgs/orgs.schema";

export const mattersTable = pgTable("matters", {
  id: uuid("id").primaryKey().defaultRandom(),

  // Who actually created this record
  creatorType: matterCreatorTypeEnum("creator_type").notNull(),
  createdByUserId: uuid("created_by_user_id")
    .notNull()
    .references(() => usersSchema.id),
  creatorOrgId: uuid("creator_org_id").references(() => orgsTable.id), // set only when creatorType = 'org'

  // Who the matter belongs to (the client)
  ownerType: matterOwnerTypeEnum("owner_type").notNull(),
  clientUserId: uuid("client_user_id").references(() => usersSchema.id),
  clientOrgId: uuid("client_org_id").references(() => orgsTable.id),
  externalClientName: varchar("external_client_name", { length: 255 }),
  externalClientContact: varchar("external_client_contact", { length: 255 }),

  // Firm representing the client, if any — auto-set to creatorOrgId when
  // creatorType = 'org'; can also be set later if a firm takes over a
  // matter a client opened solo.
  representingOrgId: uuid("representing_org_id").references(() => orgsTable.id),

  sourceChatId: uuid("source_chat_id").references(() => chatsSchema.id, {
    onDelete: "set null",
  }),
  title: text("title").notNull(),
  summary: text("summary"),
  status: matterStatusEnum("status").default("draft").notNull(),
  jurisdiction: varchar("jurisdiction", { length: 100 }),
  practiceArea: varchar("practice_area", { length: 100 }),
  urgency: varchar("urgency", { length: 50 }),
  metadata: jsonb("metadata").default({}).$type<Record<string, unknown>>(),
  isSharedWithLawyer: boolean("is_shared_with_lawyer").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  closedAt: timestamp("closed_at"),
});

export const matterLawyersTable = pgTable("matter_lawyers", {
  id: uuid("id").primaryKey().defaultRandom(),
  matterId: uuid("matter_id")
    .notNull()
    .references(() => mattersTable.id, { onDelete: "cascade" }),
  lawyerId: uuid("lawyer_id")
    .notNull()
    .references(() => lawyersTable.id, { onDelete: "cascade" }),
  role: matterLawyerRoleEnum("role").default("primary").notNull(),
  status: varchar("status", { length: 50 }).default("invited"),
  invitedAt: timestamp("invited_at").defaultNow().notNull(),
  acceptedAt: timestamp("accepted_at"),
  notes: text("notes"),
});

export const matterNotesTable = pgTable("matter_notes", {
  id: uuid("id").primaryKey().defaultRandom(),
  matterId: uuid("matter_id")
    .notNull()
    .references(() => mattersTable.id, { onDelete: "cascade" }),
  authorUserId: uuid("author_user_id")
    .notNull()
    .references(() => usersSchema.id),
  content: text("content").notNull(),
  isInternal: boolean("is_internal").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const matterDocumentsTable = pgTable("matter_documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  matterId: uuid("matter_id")
    .notNull()
    .references(() => mattersTable.id, { onDelete: "cascade" }),
  uploadedByUserId: uuid("uploaded_by_user_id")
    .notNull()
    .references(() => usersSchema.id),
  fileName: varchar("file_name", { length: 255 }).notNull(),
  fileUrl: varchar("file_url", { length: 1024 }).notNull(),
  fileType: varchar("file_type", { length: 100 }),
  fileSize: integer("file_size"),
  description: text("description"),
  analysis: jsonb("analysis"),
  analyzedAt: timestamp("analyzed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const matterStatusHistoryTable = pgTable("matter_status_history", {
  id: uuid("id").primaryKey().defaultRandom(),
  matterId: uuid("matter_id")
    .notNull()
    .references(() => mattersTable.id, { onDelete: "cascade" }),
  fromStatus: matterStatusEnum("from_status"),
  toStatus: matterStatusEnum("to_status").notNull(),
  changedByUserId: uuid("changed_by_user_id").references(() => usersSchema.id),
  note: text("note"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const matterEventsTable = pgTable("matter_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  matterId: uuid("matter_id")
    .notNull()
    .references(() => mattersTable.id, { onDelete: "cascade" }),
  createdByUserId: uuid("created_by_user_id")
    .notNull()
    .references(() => usersSchema.id),
  type: matterEventTypeEnum("type").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  eventAt: timestamp("event_at", { withTimezone: true }).notNull(),
  reminderAt: timestamp("reminder_at", { withTimezone: true }),
  isCompleted: boolean("is_completed").default(false).notNull(),
  metadata: jsonb("metadata").default({}).$type<Record<string, unknown>>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const matterActivitiesTable = pgTable("matter_activities", {
  id: uuid("id").primaryKey().defaultRandom(),
  matterId: uuid("matter_id")
    .notNull()
    .references(() => mattersTable.id, { onDelete: "cascade" }),
  actorUserId: uuid("actor_user_id").references(() => usersSchema.id), // null for system
  type: matterActivityTypeEnum("type").notNull(),
  title: text("title").notNull(), // short human-readable title
  description: text("description"), // optional longer text
  // Link to the underlying record when useful
  relatedNoteId: uuid("related_note_id"),
  relatedDocumentId: uuid("related_document_id"),
  relatedEventId: uuid("related_event_id"),
  relatedLawyerId: uuid("related_lawyer_id"),
  metadata: jsonb("metadata").default({}).$type<Record<string, unknown>>(),
  isInternal: boolean("is_internal").default(false).notNull(), // hide from client
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const combinedMatterSchema = {
  mattersTable,
  matterLawyersTable,
  matterNotesTable,
  matterDocumentsTable,
  matterStatusHistoryTable,
  matterEventsTable,
  matterActivitiesTable,
};
