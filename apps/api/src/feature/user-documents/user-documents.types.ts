import { z } from "zod";

/*
 * ZOD SCHEMAS
 */

/** Schema for user document upload request */
export const userDocumentUploadSchema = z.object({
  sessionId: z.string().uuid("Invalid session ID"),
});

/** Schema for user document status response */
export const userDocumentStatusSchema = z.object({
  sessionId: z.string().uuid(),
  status: z.enum(["pending", "processing", "completed", "failed"]),
  filename: z.string().optional(),
  size: z.number().optional(),
  totalChunks: z.number().optional(),
  processedChunks: z.number().optional(),
  uploadedAt: z.string().datetime().optional(),
  completedAt: z.string().datetime().optional(),
  error: z.string().optional(),
  hasDocument: z.boolean(),
});

/** Schema for user document metadata stored in ChromaDB */
export const userDocumentChunkMetadataSchema = z.object({
  content: z.string(),
  chunkIndex: z.number(),
  sessionId: z.string().uuid(),
  uploadedAt: z.string().datetime(),
  filename: z.string(),
  totalChunks: z.number(),
});

/*
 * DOMAIN TYPES
 */

export type UserDocumentUpload = z.infer<typeof userDocumentUploadSchema>;
export type UserDocumentStatus = z.infer<typeof userDocumentStatusSchema>;
export type UserDocumentChunkMetadata = z.infer<
  typeof userDocumentChunkMetadataSchema
>;

/*
 * INGESTION EVENT TYPES
 */

export type UserDocumentEventType =
  "started" | "progress" | "completed" | "error";

export type UserDocumentEvent = {
  type: UserDocumentEventType;
  data: {
    timestamp: string;
    filename?: string;
    size?: number;
    processed?: number;
    total?: number;
    percentage?: number;
    chunk?: number;
    totalChunks?: number;
    message?: string;
    code?: string;
    details?: unknown;
  };
};

/*
 * RAG CONTEXT TYPES
 */

/** Source type indicator for hybrid context */
export const DocumentSource = {
  USER_DOCUMENT: "user_document",
  LEGAL_CORPUS: "legal_corpus",
} as const;

export type DocumentSource =
  (typeof DocumentSource)[keyof typeof DocumentSource];

/** Chunk with source attribution */
export interface AttributedChunk {
  id: string;
  content: string;
  source: DocumentSource;
  similarity?: number;
  metadata: {
    // User document metadata
    sessionId?: string;
    filename?: string;
    chunkIndex?: number;
    // Legal corpus metadata
    title?: string;
    section?: string;
    actName?: string;
    fullCitation?: string;
    jurisdiction?: string;
  };
}

/*
 * QUEUE-RELATED TYPES
 */

export const UserDocumentCleanupPayloadSchema = z.object({
  sessionId: z.string().uuid(),
  collectionName: z.string(),
  expiresAt: z.string().datetime(),
});

export type UserDocumentCleanupPayload = z.infer<
  typeof UserDocumentCleanupPayloadSchema
>;

export interface UserDocumentJobMap {
  "user-document-cleanup": UserDocumentCleanupPayload;
}

/*
 * API RESPONSE TYPES
 */

export interface UserDocumentUploadResponse {
  sessionId: string;
  status: "pending" | "processing" | "completed" | "failed";
  message: string;
}

export interface UserDocumentDeleteResponse {
  sessionId: string;
  deleted: boolean;
  message: string;
}
