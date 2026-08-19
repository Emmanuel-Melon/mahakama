import { useQuery } from "@tanstack/react-query";
import {
  userDocumentsApi,
  type UserDocumentStatus,
  type UserDocumentDeleteResponse,
} from "../../clients/user-documents.api";
import type { ApiClientError } from "../../api/api.errors";
import { useAppMutation } from "../../react-query/react-query.utils";

/**
 * Query keys for user document operations
 */
export const userDocumentsKeys = {
  all: ["userDocuments"] as const,
  status: (sessionId: string) =>
    [...userDocumentsKeys.all, "status", sessionId] as const,
} as const;

/*
 * ========================================
 * QUERIES
 * ========================================
 */
export const userDocumentsQueries = {
  status: (sessionId: string) => ({
    queryKey: userDocumentsKeys.status(sessionId),
    queryFn: () => userDocumentsApi.getUserDocumentStatus(sessionId),
    enabled: !!sessionId,
    staleTime: 30_000, // 30 seconds
    refetchInterval: false as const,
  }),
};

/**
 * Hook for getting user document status
 *
 * @param sessionId - The chat session ID
 * @returns Document status query
 */
export function useUserDocumentStatus(sessionId: string) {
  return useQuery<UserDocumentStatus, ApiClientError>(
    userDocumentsQueries.status(sessionId),
  );
}

/*
 * ========================================
 * MUTATIONS
 * ========================================
 */
/**
 * Hook for deleting user documents
 *
 * @returns Delete mutation
 */
export function useDeleteUserDocument() {
  return useAppMutation<UserDocumentDeleteResponse, ApiClientError, string>({
    mutationFn: (sessionId) => userDocumentsApi.deleteUserDocument(sessionId),
    messages: {
      success: "Document deleted successfully!",
      error: (err) =>
        err.errors?.[0]?.detail ?? "Failed to delete user document.",
    },
    invalidates: (sessionId) => [userDocumentsKeys.status(sessionId)],
  });
}
