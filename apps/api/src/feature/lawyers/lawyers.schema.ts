import {
  pgTable,
  varchar,
  integer,
  boolean,
  text,
  timestamp,
  uuid,
  pgEnum,
  numeric,
  jsonb,
} from "drizzle-orm/pg-core";
import { usersSchema } from "@/feature/users/users.schema";

export const lawyerDocumentTypeEnum = pgEnum("lawyer_document_type", [
  "bar_certificate",
  "national_id",
  "other",
]);

export const lawyerInviteStatusEnum = pgEnum("lawyer_invite_status", [
  "pending",
  "accepted",
  "expired",
  "revoked",
]);

export const lawyerProfileStatusEnum = pgEnum("lawyer_profile_status", [
  "draft",
  "submitted",
  "approved",
  "rejected",
]);

export const lawyerInvitesTable = pgTable("lawyer_invites", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull(),
  invitedBy: uuid("invited_by")
    .notNull()
    .references(() => usersSchema.id),
  token: varchar("token", { length: 255 }).notNull().unique(),
  status: lawyerInviteStatusEnum("status").default("pending").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  acceptedAt: timestamp("accepted_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const lawyersTable = pgTable("lawyers", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .unique()
    .references(() => usersSchema.id),
  status: lawyerProfileStatusEnum("status").default("draft").notNull(),

  // directory-facing fields, carried over from the original table
  specialization: varchar("specialization", { length: 100 }),
  experienceYears: integer("experience_years"),
  casesHandled: integer("cases_handled").default(0).notNull(),
  isAvailable: boolean("is_available").default(false).notNull(), // gated off until approved
  location: varchar("location", { length: 100 }),
  languages: text("languages").array(),

  // credential fields, needed for review
  bio: text("bio"),
  barNumber: varchar("bar_number", { length: 100 }),
  issuingAuthority: varchar("issuing_authority", { length: 255 }),
  jurisdiction: varchar("jurisdiction", { length: 100 }),
  education: jsonb("education"), // [{ institution, degree, year }]

  submittedAt: timestamp("submitted_at"),
  reviewedBy: uuid("reviewed_by").references(() => usersSchema.id),
  reviewedAt: timestamp("reviewed_at"),
  rejectionReason: text("rejection_reason"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const lawyerProfileDocumentsTable = pgTable("lawyer_profile_documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  lawyerProfileId: uuid("lawyer_profile_id")
    .notNull()
    .references(() => lawyersTable.id, { onDelete: "cascade" }),
  type: lawyerDocumentTypeEnum("type").notNull(),
  fileUrl: varchar("file_url", { length: 1024 }).notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
});

export const combinedLawyersSchema = {
  lawyers: lawyersTable,
  lawyerInvites: lawyerInvitesTable,
  lawyerProfileDocuments: lawyerProfileDocumentsTable,
};
