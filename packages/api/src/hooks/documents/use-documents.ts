import { useQuery } from "@tanstack/react-query";
import {
  documentsApi,
  type SessionDocumentStatus,
  type SessionDocumentDeleteResponse,
} from "../../clients/documents.api";
import type { ApiClientError } from "../../api/api.errors";
import { useAppMutation } from "../../react-query/react-query.utils";

/**
 * Query keys for document operations
 */
export const documentsKeys = {
  all: ["documents"] as const,
  status: (sessionId: string) =>
    [...documentsKeys.all, "status", sessionId] as const,
} as const;

/*
 * ========================================
 * QUERIES
 * ========================================
 */
export const documentsQueries = {
  status: (sessionId: string) => ({
    queryKey: documentsKeys.status(sessionId),
    queryFn: () => documentsApi.getDocumentStatus(sessionId),
    enabled: !!sessionId,
    staleTime: 30_000, // 30 seconds
    refetchInterval: false as const,
  }),
};

/**
 * Hook for getting document status
 *
 * @param sessionId - The chat session ID
 * @returns Document status query
 */
export function useDocumentStatus(sessionId: string) {
  return useQuery<SessionDocumentStatus, ApiClientError>(
    documentsQueries.status(sessionId),
  );
}

/*
 * ========================================
 * MUTATIONS
 * ========================================
 */
/**
 * Hook for deleting documents
 *
 * @returns Delete mutation
 */
export function useDeleteDocument() {
  return useAppMutation<SessionDocumentDeleteResponse, ApiClientError, string>({
    mutationFn: (sessionId) => documentsApi.deleteDocument(sessionId),
    messages: {
      success: "Document deleted successfully!",
      error: (err) => err.errors?.[0]?.detail ?? "Failed to delete document.",
    },
    invalidates: (sessionId) => [documentsKeys.status(sessionId)],
  });
}
