import { z } from "zod";
import { createSelectSchema, createInsertSchema } from "drizzle-zod";
import {
  bookmarksTable,
  documentsTable,
  downloadsTable,
} from "./corpus.schema";
import { CorpusJobs } from "./corpus.config";
import { baseQuerySchema } from "@/lib/express/express.types";
import { crudMeta } from "@/lib/openapi/openapi.utils";
import {
  DocumentChunk,
  EmbeddingBatchProgress,
} from "@/service/embedding-service/embeddings.types";

/*
 * DRIZZLE-GENERATED SCHEMAS (from PostgreSQL tables)
 */

const baseInsert = createInsertSchema(documentsTable);
const baseSelect = createSelectSchema(documentsTable);

export const corpusSelectSchema = crudMeta(baseSelect, "select", "Corpus");

export const corpusInsertSchema = crudMeta(
  baseInsert.refine((data) => /^\d{4}-\d{2}-\d{2}$/.test(data.lastUpdated), {
    message: "lastUpdated must be a date in YYYY-MM-DD format",
    path: ["lastUpdated"],
  }),
  "insert",
  "Corpus",
);

export const corpusUpdateSchema = crudMeta(
  baseInsert
    .partial()
    .refine(
      (data) =>
        data.lastUpdated === undefined ||
        /^\d{4}-\d{2}-\d{2}$/.test(data.lastUpdated),
      {
        message: "lastUpdated must be a date in YYYY-MM-DD format",
        path: ["lastUpdated"],
      },
    ),
  "update",
  "Corpus",
);

export const corpusIngestionEventSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("started"),
    data: z.object({
      timestamp: z.string().datetime(),
      filename: z.string(),
      size: z.number().int().nonnegative(),
    }),
  }),
  z.object({
    type: z.literal("progress"),
    data: z.object({
      processed: z.number().int().nonnegative(),
      total: z.number().int().positive(),
      percentage: z.number().min(0).max(100),
      chunk: z.number().int().positive(),
      totalChunks: z.number().int().positive(),
    }),
  }),
  z.object({
    type: z.literal("content"),
    data: z.object({
      chunk: z.number().int().positive(),
      preview: z.string(),
    }),
  }),
  z.object({
    type: z.literal("completed"),
    data: z.object({
      filename: z.string(),
      size: z.number().int().nonnegative(),
      processedAt: z.string().datetime(),
      totalChunks: z.number().int().positive(),
    }),
  }),
  z.object({
    type: z.literal("error"),
    data: z.object({
      message: z.string(),
      code: z.string().optional(),
      details: z.unknown().optional(),
    }),
  }),
]);

export const corpusQuerySchema = baseQuerySchema.extend({
  type: z.string().optional(),
});

/*
 * DOMAIN-RELATED TYPES
 */

export type Corpus = z.infer<typeof corpusSelectSchema>;
export type NewCorpus = z.infer<typeof corpusInsertSchema>;
export type UpdateCorpus = z.infer<typeof corpusUpdateSchema>;
export type Bookmark = typeof bookmarksTable.$inferSelect;
export type NewBookmark = typeof bookmarksTable.$inferInsert;
export type Download = typeof downloadsTable.$inferSelect;
export type NewDownload = typeof downloadsTable.$inferInsert;
export type RemoveCorpusOptions = {
  userId?: string;
};

export type CorpusFilters = z.infer<typeof corpusQuerySchema>;
export type FindBookmarkOptions = {
  userId?: string;
};
export type RemoveBookmarkOptions = {
  userId?: string;
};

/*
 * DATABASE QUERY TYPES
 */
export type CorpusColumn = typeof documentsTable._.columns;
export type CorpusColumnKey = keyof CorpusColumn;
export type BookmarkColumn = typeof bookmarksTable._.columns;
export type BookmarkColumnKey = keyof BookmarkColumn;

/*
 * QUEUE-RELATED TYPES
 */
export const CorpusUploadedPayloadSchema = z.object({
  documentId: z.string(),
  userId: z.string(),
  filename: z.string().optional(),
  size: z.number().optional(),
});

export type CorpusUploadedPayload = z.infer<
  typeof CorpusUploadedPayloadSchema
>;

export interface CorpusJobMap {
  [CorpusJobs.CorpusUploaded]: CorpusUploadedPayload;
}

/*
 * RAG/SEARCH TYPES
 */

export interface LegalCorpusChunk {
  id: string;
  title: string;
  category: string;
  source: string;
  content: string;
  similarity?: number;
}

/*
 * API PARAMETER TYPES
 */

export interface BookmarkCorpusParams {
  documentId: string;
  user_id: string;
}

export interface DownloadCorpusParams {
  documentId: string;
  user_id: string;
}

export interface ShareCorpusParams {
  documentId: string;
}

/*
 * RESPONSE TYPES
 */

export interface CorpusShareInfo {
  documentId: string;
  title: string;
  shareableLink: string;
  socialLinks: {
    twitter: string;
    facebook: string;
    linkedin: string;
    whatsapp: string;
    email: string;
  };
}

/*
 * INGESTION PIPELINE
 */
export type CorpusEventType =
  "started" | "progress" | "content" | "completed" | "error";

export type CorpusIngestionEventType = CorpusIngestionEvent["type"];

export type CorpusIngestionEvent = Extract<
  {
    [K in CorpusEventType]: {
      type: K;
      data: K extends "started"
        ? {
            timestamp: string;
            filename: string;
            size: number;
          }
        : K extends "progress"
          ? {
              processed: number;
              total: number;
              percentage: number;
              chunk: number;
              totalChunks: number;
            }
          : K extends "content"
            ? {
                chunk: number;
                preview: string;
              }
            : K extends "completed"
              ? {
                  filename: string;
                  size: number;
                  processedAt: string;
                  totalChunks: number;
                }
              : K extends "error"
                ? {
                    message: string;
                    code?: string;
                    details?: unknown;
                  }
                : never;
    };
  }[CorpusEventType],
  { type: string; data: any }
>;

export type CorpusPipelineResult = {
  totalChunks: number;
  chunkVersion: number;
  title: string;
};

export type CorpusPipelineOptions = {
  onBatchProgress?: (
    progress: EmbeddingBatchProgress,
    latestChunk?: DocumentChunk,
  ) => void;
};
