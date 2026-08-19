import { JsonApiResourceConfig } from "@/lib/express/express.types";
import { UserDocumentStatus } from "./user-documents.types";

export const SerializedUserDocumentStatus: JsonApiResourceConfig<UserDocumentStatus> =
  {
    type: "user-document-status",
    attributes: (status: UserDocumentStatus) => status,
  };

export interface UserDocumentDeletionResult {
  sessionId: string;
  deleted: boolean;
  message: string;
}

export const SerializedUserDocumentDeletion: JsonApiResourceConfig<UserDocumentDeletionResult> =
  {
    type: "user-document-deletion",
    attributes: (result: UserDocumentDeletionResult) => result,
  };

export const UserDocumentJobs = {
  /** Job to clean up expired user document collections */
  CleanupExpiredDocuments: "cleanup-expired-documents",
} as const;

export type UserDocumentJobType =
  (typeof UserDocumentJobs)[keyof typeof UserDocumentJobs];

export const UserDocumentConfig = {
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

export const USER_DOCUMENT_CONFIG = {
  /** TTL in milliseconds (24 hours) */
  SESSION_TTL_MS: UserDocumentConfig.SESSION_TTL_MS,

  /** Cleanup job interval in milliseconds (1 hour) */
  CLEANUP_INTERVAL_MS: UserDocumentConfig.CLEANUP_INTERVAL_MS,

  /** Maximum file size in bytes (10MB) */
  MAX_FILE_SIZE_BYTES: UserDocumentConfig.MAX_FILE_SIZE_BYTES,

  /** Allowed MIME types */
  ALLOWED_MIME_TYPES: UserDocumentConfig.ALLOWED_MIME_TYPES,
} as const;
