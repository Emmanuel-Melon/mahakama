// embeddings.schema.ts
import {
  pgTable,
  text,
  integer,
  timestamp,
  uuid,
  vector,
  index,
  date,
} from "drizzle-orm/pg-core";
import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { documentsTable } from "@/feature/documents/documents.schema";
import { EMBEDDING_CONFIG } from "./embeddings.config";

extendZodWithOpenApi(z);

export const documentChunksTable = pgTable(
  "document_chunks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    documentId: uuid("document_id")
      .notNull()
      .references(() => documentsTable.id, { onDelete: "cascade" }),

    content: text("content").notNull(),
    chunkIndex: integer("chunk_index").notNull(),

    section: text("section"),
    subsection: text("subsection"),
    articleNumber: integer("article_number"),

    actName: text("act_name"),
    fullCitation: text("full_citation"),
    url: text("url"),
    jurisdiction: text("jurisdiction"),
    lastUpdated: date("last_updated"),

    version: integer("version"),

    // Literal from EMBEDDING_CONFIG, not read from parsed runtime config —
    // Drizzle needs the dimension at schema-definition time, and a literal
    // here means changing it requires a code change (and therefore a
    // migration), not just an env var flip in prod.
    embedding: vector("embedding", { dimensions: EMBEDDING_CONFIG.DIMENSIONS }),
    embeddingProvider: text("embedding_provider"),
    embeddingModel: text("embedding_model"),

    tokenCount: integer("token_count"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    documentIdx: index("document_idx").on(table.documentId),
    embeddingIdx: index("embedding_idx").using(
      "hnsw",
      table.embedding.op("vector_cosine_ops"),
    ),
  }),
);

export const embeddingJobsTable = pgTable("embedding_jobs", {
  id: uuid("id").primaryKey().defaultRandom(),
  documentId: uuid("document_id")
    .notNull()
    .references(() => documentsTable.id, { onDelete: "cascade" }),
  status: text("status").notNull(),
  totalChunks: integer("total_chunks"),
  processedChunks: integer("processed_chunks").default(0),
  error: text("error"),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const combinedembeddingsSchema = {
  documentChunksTable,
  embeddingJobsTable,
};