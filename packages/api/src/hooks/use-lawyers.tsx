import { useQuery } from "@tanstack/react-query";
import {
  lawyersApi,
  type LawyerCollection,
  type LawyerResult,
  type NewLawyer,
  type UpdateLawyer,
  type LawyerInviteCollection,
  type LawyerInviteResult,
  type NewLawyerInvite,
  type UpdateInviteStatusRequest,
  type LawyerProfileDocumentResult,
  type NewLawyerProfileDocument,
  type RejectLawyerRequest,
} from "../clients/lawyers.api";
import type { ApiClientError } from "../api/api.errors";
import { useAppMutation } from "../react-query/react-query.utils";

/*
 * ========================================
 * QUERY KEYS
 * ========================================
 */
export const lawyersKeys = {
  all: ["lawyers"] as const,
  directory: (filters?: Record<string, unknown>) =>
    [...lawyersKeys.all, "directory", filters] as const,
  profile: () => [...lawyersKeys.all, "profile"] as const,
  lawyers: (filters?: Record<string, unknown>) =>
    [...lawyersKeys.all, "lawyers", filters] as const,
  lawyer: (id: string) => [...lawyersKeys.all, "lawyer", id] as const,
  invites: () => [...lawyersKeys.all, "invites"] as const,
  documents: (profileId: string) =>
    [...lawyersKeys.all, "documents", profileId] as const,
} as const;

/*
 * ========================================
 * QUERIES
 * ========================================
 */
export const lawyersQueries = {
  directory: (filters?: {
    specialization?: string;
    location?: string;
    q?: string;
  }) => ({
    queryKey: lawyersKeys.directory(filters),
    queryFn: () => lawyersApi.getDirectory(filters),
  }),

  profile: () => ({
    queryKey: lawyersKeys.profile(),
    queryFn: () => lawyersApi.getProfile(),
  }),

  lawyers: (filters?: {
    specialization?: string;
    location?: string;
    status?: string;
    q?: string;
  }) => ({
    queryKey: lawyersKeys.lawyers(filters),
    queryFn: () => lawyersApi.getLawyers(filters),
  }),

  lawyer: (id: string) => ({
    queryKey: lawyersKeys.lawyer(id),
    queryFn: () => lawyersApi.getLawyerById(id),
    enabled: !!id,
  }),

  invites: () => ({
    queryKey: lawyersKeys.invites(),
    queryFn: () => lawyersApi.getInvites(),
  }),
};

/*
 * ========================================
 * QUERY HOOKS
 * ========================================
 */

/** Public directory of approved lawyers */
export function useDirectory(filters?: {
  specialization?: string;
  location?: string;
  q?: string;
}) {
  return useQuery<LawyerCollection, ApiClientError>(
    lawyersQueries.directory(filters),
  );
}

/** Current user's own lawyer profile */
export function useLawyerProfile() {
  return useQuery<LawyerResult, ApiClientError>(lawyersQueries.profile());
}

/** Admin: list all lawyers with filters */
export function useLawyers(filters?: {
  specialization?: string;
  location?: string;
  status?: string;
  q?: string;
}) {
  return useQuery<LawyerCollection, ApiClientError>(
    lawyersQueries.lawyers(filters),
  );
}

/** Admin: get single lawyer by ID */
export function useLawyer(id: string) {
  return useQuery<LawyerResult, ApiClientError>(lawyersQueries.lawyer(id));
}

/** Admin: list all invites */
export function useInvites() {
  return useQuery<LawyerInviteCollection, ApiClientError>(
    lawyersQueries.invites(),
  );
}

/*
 * ========================================
 * MUTATIONS
 * ========================================
 */

/** Lawyer: create own profile */
export function useCreateProfile() {
  return useAppMutation<LawyerResult, ApiClientError, NewLawyer>({
    mutationFn: (data) => lawyersApi.createProfile(data),
    messages: {
      success: "Lawyer profile created!",
      error: (err) => err.errors?.[0]?.detail ?? "Failed to create profile.",
    },
    invalidates: [lawyersKeys.profile()],
  });
}

/** Lawyer: update own profile */
export function useUpdateProfile() {
  return useAppMutation<LawyerResult, ApiClientError, UpdateLawyer>({
    mutationFn: (data) => lawyersApi.updateProfile(data),
    messages: {
      success: "Profile updated!",
      error: (err) => err.errors?.[0]?.detail ?? "Failed to update profile.",
    },
    invalidates: [lawyersKeys.profile()],
  });
}

/** Lawyer: submit profile for review */
export function useSubmitProfile() {
  return useAppMutation<LawyerResult, ApiClientError, void>({
    mutationFn: () => lawyersApi.submitProfile(),
    messages: {
      success: "Profile submitted for review!",
      error: (err) => err.errors?.[0]?.detail ?? "Failed to submit profile.",
    },
    invalidates: [lawyersKeys.profile()],
  });
}

/** Lawyer: upload credential document */
export function useUploadDocument() {
  return useAppMutation<
    LawyerProfileDocumentResult,
    ApiClientError,
    NewLawyerProfileDocument
  >({
    mutationFn: (data) => lawyersApi.uploadDocument(data),
    messages: {
      success: "Document uploaded!",
      error: (err) => err.errors?.[0]?.detail ?? "Failed to upload document.",
    },
  });
}

/** Lawyer: delete credential document */
export function useDeleteDocument() {
  return useAppMutation<void, ApiClientError, string>({
    mutationFn: (documentId) => lawyersApi.deleteDocument(documentId),
    messages: {
      success: "Document removed.",
      error: (err) => err.errors?.[0]?.detail ?? "Failed to delete document.",
    },
  });
}

/** Admin: approve a lawyer */
export function useApproveLawyer() {
  return useAppMutation<LawyerResult, ApiClientError, string>({
    mutationFn: (lawyerId) => lawyersApi.approveLawyer(lawyerId),
    messages: {
      success: "Lawyer approved!",
      error: (err) => err.errors?.[0]?.detail ?? "Failed to approve lawyer.",
    },
    invalidates: (lawyerId) => [
      lawyersKeys.lawyer(lawyerId),
      lawyersKeys.lawyers(),
    ],
  });
}

/** Admin: reject a lawyer */
export function useRejectLawyer() {
  return useAppMutation<
    LawyerResult,
    ApiClientError,
    { lawyerId: string; data: RejectLawyerRequest }
  >({
    mutationFn: ({ lawyerId, data }) => lawyersApi.rejectLawyer(lawyerId, data),
    messages: {
      success: "Lawyer rejected.",
      error: (err) => err.errors?.[0]?.detail ?? "Failed to reject lawyer.",
    },
    invalidates: ({ lawyerId }) => [
      lawyersKeys.lawyer(lawyerId),
      lawyersKeys.lawyers(),
    ],
  });
}

/** Admin: create an invite */
export function useCreateInvite() {
  return useAppMutation<LawyerInviteResult, ApiClientError, NewLawyerInvite>({
    mutationFn: (data) => lawyersApi.createInvite(data),
    messages: {
      success: "Invite created!",
      error: (err) => err.errors?.[0]?.detail ?? "Failed to create invite.",
    },
    invalidates: [lawyersKeys.invites()],
  });
}

/** Admin: update invite status */
export function useUpdateInvite() {
  return useAppMutation<
    LawyerInviteResult,
    ApiClientError,
    { inviteId: string; data: UpdateInviteStatusRequest }
  >({
    mutationFn: ({ inviteId, data }) => lawyersApi.updateInvite(inviteId, data),
    messages: {
      success: "Invite updated!",
      error: (err) => err.errors?.[0]?.detail ?? "Failed to update invite.",
    },
    invalidates: [lawyersKeys.invites()],
  });
}
