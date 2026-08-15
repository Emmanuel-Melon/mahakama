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

extendZodWithOpenApi(z);

export const documentChunksTable = pgTable(
  "document_chunks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    documentId: uuid("document_id")
      .notNull()
      .references(() => documentsTable.id, { onDelete: "cascade" }),

    // Chunk content
    content: text("content").notNull(),
    chunkIndex: integer("chunk_index").notNull(),

    // Legal metadata
    section: text("section"), // e.g., "Section 26"
    subsection: text("subsection"), // e.g., "26(1)(a)"
    articleNumber: integer("article_number"),

    // Citation metadata (mirrors Chroma metadata; section_number reuses `section`)
    actName: text("act_name"), // e.g., "Land Act, 2012"
    fullCitation: text("full_citation"), // e.g., "Land Act, 2012, Section 4(2)"
    url: text("url"), // link to the authoritative document
    jurisdiction: text("jurisdiction"), // e.g., "Uganda"
    lastUpdated: date("last_updated"), // date of last amendment / ingest

    // Versioning (see metadata-updates.md U1)
    version: integer("version"), // document version this chunk belongs to

    // Vector embedding (pgvector extension)
    // embedding: vector("embedding", { dimensions: 1536 }), // OpenAI ada-002

    // Metadata
    tokenCount: integer("token_count"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    // Index for vector similarity search
    // embeddingIdx: index("embedding_idx").using(
    //   "hnsw",
    //   table.embedding.op("vector_cosine_ops"),
    // ),
    // Index for filtering by document
    documentIdx: index("document_idx").on(table.documentId),
  }),
);

export const embeddingJobsTable = pgTable("embedding_jobs", {
  id: uuid("id").primaryKey().defaultRandom(),
  documentId: uuid("document_id")
    .notNull()
    .references(() => documentsTable.id, { onDelete: "cascade" }),
  status: text("status").notNull(), // 'pending' | 'processing' | 'completed' | 'failed'
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
