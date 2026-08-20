import { JsonApiResourceConfig } from "@/lib/express/express.types";
import { SessionDocumentStatus } from "./documents.types";

export const SerializedDocumentStatus: JsonApiResourceConfig<SessionDocumentStatus> =
  {
    type: "document-status",
    attributes: (status: SessionDocumentStatus) => status,
  };

export interface DocumentDeletionResult {
  sessionId: string;
  deleted: boolean;
  message: string;
}

export const SerializedDocumentDeletion: JsonApiResourceConfig<DocumentDeletionResult> =
  {
    type: "document-deletion",
    attributes: (result: DocumentDeletionResult) => result,
  };

export const DocumentJobs = {
  /** Job to clean up expired document collections */
  CleanupExpiredDocuments: "cleanup-expired-documents",
} as const;

export type DocumentJobType = (typeof DocumentJobs)[keyof typeof DocumentJobs];

export const DocumentConfig = {
  /** Session TTL in milliseconds (24 hours) */
  SESSION_TTL_MS: 24 * 60 * 60 * 1000,

  /** Cleanup job interval in milliseconds (1 hour) */
  CLEANUP_INTERVAL_MS: 60 * 60 * 1000,

  /** Maximum file size in bytes (10MB) */
  MAX_FILE_SIZE_BYTES: 10 * 1024 * 1024,

  /** Allowed MIME types */
  ALLOWED_MIME_TYPES: ["application/pdf"] as const,

  /** Chunk size for parsing (characters) */
  CHUNK_SIZE: 1000,

  /** Chunk overlap for parsing (characters) */
  CHUNK_OVERLAP: 200,

  /** Top-k results when querying with user document */
  QUERY_TOP_K_WITH_USER_DOC: 10,

  /** Top-k results when querying without user document */
  QUERY_TOP_K_DEFAULT: 5,
} as const;

export const DOCUMENT_CONFIG = {
  /** TTL in milliseconds (24 hours) */
  SESSION_TTL_MS: DocumentConfig.SESSION_TTL_MS,

  /** Cleanup job interval in milliseconds (1 hour) */
  CLEANUP_INTERVAL_MS: DocumentConfig.CLEANUP_INTERVAL_MS,

  /** Maximum file size in bytes (10MB) */
  MAX_FILE_SIZE_BYTES: DocumentConfig.MAX_FILE_SIZE_BYTES,

  /** Allowed MIME types */
  ALLOWED_MIME_TYPES: DocumentConfig.ALLOWED_MIME_TYPES,
} as const;
