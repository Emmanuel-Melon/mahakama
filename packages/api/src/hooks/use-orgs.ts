import { useQuery } from "@tanstack/react-query";
import {
  orgsApi,
  type OrgResult,
  type OrgsResult,
  type OrgMemberResult,
  type OrgMemberCollection,
  type OrgListParams,
  type OrgMemberListParams,
  type NewOrg,
  type UpdateOrg,
  type NewOrgMember,
  type UpdateOrgMember,
} from "../clients/orgs.api";
import type { ApiClientError } from "../api/api.errors";
import { useAppMutation } from "../react-query/react-query.utils";

export const orgKeys = {
  all: ["orgs"] as const,
  lists: () => [...orgKeys.all, "list"] as const,
  list: (filters: OrgListParams) => [...orgKeys.lists(), { filters }] as const,
  details: () => [...orgKeys.all, "detail"] as const,
  detail: (id: string) => [...orgKeys.details(), id] as const,
  members: (orgId: string) => [...orgKeys.all, "members", orgId] as const,
  member: (orgId: string, userId: string) =>
    [...orgKeys.all, "member", orgId, userId] as const,
} as const;

/*
 * ========================================
 * INVALIDATIONS
 * ========================================
 */
export const invalidations = {
  detail: (id: string) => [orgKeys.lists(), orgKeys.detail(id)],
  members: (orgId: string) => [
    orgKeys.detail(orgId),
    orgKeys.members(orgId),
  ],
  lists: () => [orgKeys.lists()],
};

/*
 * ========================================
 * QUERIES
 * ========================================
 */
export const orgQueries = {
  list: (params: OrgListParams = {}) => ({
    queryKey: orgKeys.list(params),
    queryFn: () => orgsApi.getOrgs(params),
  }),
  detail: (orgId: string) => ({
    queryKey: orgKeys.detail(orgId),
    queryFn: () => orgsApi.getOrgById(orgId),
    enabled: !!orgId,
  }),
  members: (orgId: string, params: OrgMemberListParams = {}) => ({
    queryKey: orgKeys.members(orgId),
    queryFn: () => orgsApi.getOrgMembers(orgId, params),
    enabled: !!orgId,
  }),
};

/*
 * ========================================
 * REACT HOOKS
 * ========================================
 */
export function useOrgs(params: OrgListParams = {}) {
  return useQuery<OrgsResult, ApiClientError>({
    ...orgQueries.list(params),
  });
}

export function useOrg(orgId: string) {
  return useQuery<OrgResult, ApiClientError>({
    ...orgQueries.detail(orgId),
  });
}

export function useOrgMembers(orgId: string, params: OrgMemberListParams = {}) {
  return useQuery<OrgMemberCollection, ApiClientError>({
    ...orgQueries.members(orgId, params),
  });
}

/*
 * ========================================
 * MUTATIONS
 * ========================================
 */
export interface UseOrgMutationsOptions {
  onCreateSuccess?: (data: OrgResult) => void;
  onUpdateSuccess?: (data: OrgResult) => void;
  onInviteMemberSuccess?: (data: OrgMemberResult) => void;
  onUpdateMemberSuccess?: (data: OrgMemberResult) => void;
  onRemoveMemberSuccess?: (data: OrgMemberResult) => void;
}

export const useOrgMutations = (options?: UseOrgMutationsOptions) => {
  const createOrg = useAppMutation<OrgResult, ApiClientError, NewOrg>({
    mutationFn: (data) => orgsApi.createOrg(data),
    messages: {
      success: "Org created!",
      error: (err) =>
        err.errors?.[0]?.detail ?? "Failed to create org. Please try again.",
    },
    invalidates: () => invalidations.lists(),
    onSuccess: options?.onCreateSuccess,
  });

  const updateOrg = useAppMutation<
    OrgResult,
    ApiClientError,
    { orgId: string; data: UpdateOrg }
  >({
    mutationFn: ({ orgId, data }) => orgsApi.updateOrg(orgId, data),
    messages: {
      success: "Org updated!",
      error: (err) =>
        err.errors?.[0]?.detail ?? "Failed to update org. Please try again.",
    },
    invalidates: (variables) => invalidations.detail(variables.orgId),
    onSuccess: options?.onUpdateSuccess,
  });

  const inviteMember = useAppMutation<
    OrgMemberResult,
    ApiClientError,
    { orgId: string; data: NewOrgMember }
  >({
    mutationFn: ({ orgId, data }) => orgsApi.inviteOrgMember(orgId, data),
    messages: {
      success: "Member invited!",
      error: (err) =>
        err.errors?.[0]?.detail ?? "Failed to invite member. Please try again.",
    },
    invalidates: (variables) => invalidations.members(variables.orgId),
    onSuccess: options?.onInviteMemberSuccess,
  });

  const updateMember = useAppMutation<
    OrgMemberResult,
    ApiClientError,
    { orgId: string; userId: string; data: UpdateOrgMember }
  >({
    mutationFn: ({ orgId, userId, data }) =>
      orgsApi.updateOrgMember(orgId, userId, data),
    messages: {
      success: "Member updated!",
      error: (err) =>
        err.errors?.[0]?.detail ?? "Failed to update member. Please try again.",
    },
    invalidates: (variables) => invalidations.members(variables.orgId),
    onSuccess: options?.onUpdateMemberSuccess,
  });

  const removeMember = useAppMutation<
    OrgMemberResult,
    ApiClientError,
    { orgId: string; userId: string }
  >({
    mutationFn: ({ orgId, userId }) => orgsApi.removeOrgMember(orgId, userId),
    messages: {
      success: "Member removed!",
      error: (err) =>
        err.errors?.[0]?.detail ?? "Failed to remove member. Please try again.",
    },
    invalidates: (variables) => invalidations.members(variables.orgId),
    onSuccess: options?.onRemoveMemberSuccess,
  });

  return {
    createOrg,
    updateOrg,
    inviteMember,
    updateMember,
    removeMember,
  };
};

export function useCreateOrg(options?: UseOrgMutationsOptions) {
  return useOrgMutations(options).createOrg;
}

export function useInviteOrgMember(options?: UseOrgMutationsOptions) {
  return useOrgMutations(options).inviteMember;
}
