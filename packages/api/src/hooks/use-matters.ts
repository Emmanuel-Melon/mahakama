import { useQuery } from "@tanstack/react-query";
import {
  mattersApi,
  type MatterResult,
  type MattersResult,
  type MatterLawyerResult,
  type MatterLawyerCollection,
  type MatterNoteResult,
  type MatterNoteCollection,
  type MatterDocumentCollection,
  type MatterTimelineEntry,
  type MatterListParams,
  type NewMatter,
  type UpdateMatter,
  type NewMatterLawyer,
  type UpdateMatterLawyer,
  type NewMatterNote,
} from "../clients/matters.api";
import type { ApiClientError } from "../api/api.errors";
import { useAppMutation } from "../react-query/react-query.utils";

export const matterKeys = {
  all: ["matters"] as const,
  lists: () => [...matterKeys.all, "list"] as const,
  list: (filters: MatterListParams) =>
    [...matterKeys.lists(), { filters }] as const,
  details: () => [...matterKeys.all, "detail"] as const,
  detail: (id: string) => [...matterKeys.details(), id] as const,
  lawyers: (id: string) => [...matterKeys.all, "lawyers", id] as const,
  timeline: (id: string) => [...matterKeys.all, "timeline", id] as const,
  notes: (id: string) => [...matterKeys.all, "notes", id] as const,
  documents: (id: string) => [...matterKeys.all, "documents", id] as const,
} as const;

/*
 * ========================================
 * INVALIDATIONS
 * ========================================
 */
export const invalidations = {
  detail: (id: string) => [
    matterKeys.lists(),
    matterKeys.detail(id),
    matterKeys.lawyers(id),
    matterKeys.timeline(id),
    matterKeys.notes(id),
    matterKeys.documents(id),
  ],
  lists: () => [matterKeys.lists()],
};

/*
 * ========================================
 * QUERIES
 * ========================================
 */
export const matterQueries = {
  list: (params: MatterListParams = {}) => ({
    queryKey: matterKeys.list(params),
    queryFn: () => mattersApi.getMatters(params),
  }),
  detail: (matterId: string) => ({
    queryKey: matterKeys.detail(matterId),
    queryFn: () => mattersApi.getMatterById(matterId),
    enabled: !!matterId,
  }),
  lawyers: (matterId: string) => ({
    queryKey: matterKeys.lawyers(matterId),
    queryFn: () => mattersApi.getMatterLawyers(matterId),
    enabled: !!matterId,
  }),
  timeline: (matterId: string) => ({
    queryKey: matterKeys.timeline(matterId),
    queryFn: () => mattersApi.getMatterTimeline(matterId),
    enabled: !!matterId,
  }),
  notes: (matterId: string) => ({
    queryKey: matterKeys.notes(matterId),
    queryFn: () => mattersApi.getMatterNotes(matterId),
    enabled: !!matterId,
  }),
  documents: (matterId: string) => ({
    queryKey: matterKeys.documents(matterId),
    queryFn: () => mattersApi.getMatterDocuments(matterId),
    enabled: !!matterId,
  }),
};

/*
 * ========================================
 * REACT HOOKS
 * ========================================
 */
export function useMatters(params: MatterListParams = {}) {
  return useQuery<MattersResult, ApiClientError>({
    ...matterQueries.list(params),
  });
}

export function useMatter(matterId: string) {
  return useQuery<MatterResult, ApiClientError>({
    ...matterQueries.detail(matterId),
  });
}

export function useMatterTimeline(matterId: string) {
  return useQuery<MatterTimelineEntry[], ApiClientError>({
    ...matterQueries.timeline(matterId),
  });
}

export function useMatterLawyers(matterId: string) {
  return useQuery<MatterLawyerCollection, ApiClientError>({
    ...matterQueries.lawyers(matterId),
  });
}

export function useMatterNotes(matterId: string) {
  return useQuery<MatterNoteCollection, ApiClientError>({
    ...matterQueries.notes(matterId),
  });
}

export function useMatterDocuments(matterId: string) {
  return useQuery<MatterDocumentCollection, ApiClientError>({
    ...matterQueries.documents(matterId),
  });
}

/*
 * ========================================
 * MUTATIONS
 * ========================================
 */
export interface UseMatterMutationsOptions {
  onOpenSuccess?: (data: MatterResult) => void;
  onUpdateSuccess?: (data: MatterResult) => void;
  onAssignLawyerSuccess?: (data: MatterLawyerResult) => void;
  onUpdateLawyerMeSuccess?: (data: MatterLawyerResult) => void;
  onAddNoteSuccess?: (data: MatterNoteResult) => void;
}

export const useMatterMutations = (
  options?: UseMatterMutationsOptions,
) => {
  const openMatter = useAppMutation<
    MatterResult,
    ApiClientError,
    NewMatter
  >({
    mutationFn: (data) => mattersApi.openMatter(data),
    messages: {
      success: "Matter created!",
      error: (err) =>
        err.errors?.[0]?.detail ?? "Failed to create matter. Please try again.",
    },
    invalidates: () => invalidations.lists(),
    onSuccess: options?.onOpenSuccess,
  });

  const updateMatter = useAppMutation<
    MatterResult,
    ApiClientError,
    { matterId: string; data: UpdateMatter }
  >({
    mutationFn: ({ matterId, data }) =>
      mattersApi.updateMatter(matterId, data),
    messages: {
      success: "Matter updated!",
      error: (err) =>
        err.errors?.[0]?.detail ?? "Failed to update matter. Please try again.",
    },
    invalidates: (variables) => invalidations.detail(variables.matterId),
    onSuccess: options?.onUpdateSuccess,
  });

  const assignLawyer = useAppMutation<
    MatterLawyerResult,
    ApiClientError,
    { matterId: string; data: NewMatterLawyer }
  >({
    mutationFn: ({ matterId, data }) =>
      mattersApi.createMatterLawyer(matterId, data),
    messages: {
      success: "Lawyer assigned to matter!",
      error: (err) =>
        err.errors?.[0]?.detail ??
        "Failed to assign lawyer. Please try again.",
    },
    invalidates: (variables) => invalidations.detail(variables.matterId),
    onSuccess: options?.onAssignLawyerSuccess,
  });

  const updateLawyerMe = useAppMutation<
    MatterLawyerResult,
    ApiClientError,
    { matterId: string; data: UpdateMatterLawyer }
  >({
    mutationFn: ({ matterId, data }) =>
      mattersApi.updateMatterLawyerMe(matterId, data),
    messages: {
      success: "Invite response updated!",
      error: (err) =>
        err.errors?.[0]?.detail ??
        "Failed to update invite response. Please try again.",
    },
    invalidates: (variables) => invalidations.detail(variables.matterId),
    onSuccess: options?.onUpdateLawyerMeSuccess,
  });

  const addNote = useAppMutation<
    MatterNoteResult,
    ApiClientError,
    { matterId: string; data: NewMatterNote }
  >({
    mutationFn: ({ matterId, data }) =>
      mattersApi.addMatterNote(matterId, data),
    messages: {
      success: "Note added!",
      error: (err) =>
        err.errors?.[0]?.detail ?? "Failed to add note. Please try again.",
    },
    invalidates: (variables) => invalidations.detail(variables.matterId),
    onSuccess: options?.onAddNoteSuccess,
  });

  return {
    openMatter,
    updateMatter,
    assignLawyer,
    updateLawyerMe,
    addNote,
  };
};

export function useOpenMatter(options?: UseMatterMutationsOptions) {
  return useMatterMutations(options).openMatter;
}
