import {
  pgTable,
  text,
  date,
  integer,
  timestamp,
  uuid,
  primaryKey,
} from "drizzle-orm/pg-core";
import { z } from "zod";
import { usersSchema } from "@/feature/users/users.schema";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

export const documentsTable = pgTable("documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(),
  sections: integer("sections").notNull(),
  lastUpdated: date("last_updated").notNull(), // date of last amendment / ingest
  storageUrl: text("storage_url").notNull(),
  downloadCount: integer("download_count").default(0).notNull(),
  actName: text("act_name"), // e.g., "Land Act, 2012"
  jurisdiction: text("jurisdiction"), // e.g., "Uganda"
  sourceUrl: text("source_url"), // authoritative URL for the act
  version: integer("version").default(1).notNull(), // bumped on every re-ingest
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const bookmarksTable = pgTable(
  "document_bookmarks",
  {
    user_id: uuid("user_id")
      .notNull()
      .references(() => usersSchema.id, { onDelete: "cascade" }),
    documentId: uuid("document_id")
      .notNull()
      .references(() => documentsTable.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.user_id, table.documentId] }),
    };
  },
);

export const downloadsTable = pgTable("document_downloads", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id")
    .notNull()
    .references(() => usersSchema.id, { onDelete: "cascade" }),
  document_id: uuid("document_id")
    .notNull()
    .references(() => documentsTable.id, { onDelete: "cascade" }),
  downloadedAt: timestamp("downloaded_at").defaultNow().notNull(),
});

// Audit trail for scheduled law-source diff checks (metadata-updates.md U3.4).
// One row per detected change; `action` records what the diff job did.
export const lawSourceChecksTable = pgTable("law_source_checks", {
  id: uuid("id").primaryKey().defaultRandom(),
  client: text("client").notNull(),
  documentId: uuid("document_id").references(() => documentsTable.id, {
    onDelete: "set null",
  }),
  title: text("title").notNull(),
  sourceUrl: text("source_url"),
  detectedLastUpdated: date("detected_last_updated"),
  previousLastUpdated: date("previous_last_updated"),
  action: text("action").notNull(), // no-change | reingest | new-act | detection-failed
  detail: text("detail"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const combinedCorpusSchema = {
  documentsTable,
  bookmarksTable,
  downloadsTable,
  lawSourceChecksTable,
};
