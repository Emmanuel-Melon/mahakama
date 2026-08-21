import { useQuery } from "@tanstack/react-query";
import { usersApi, type User, type UserResult } from "../clients/users.api";
import type { ApiClientError } from "../api/api.errors";
import { useAppMutation } from "../react-query/react-query.utils";

export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (filters: string) => [...userKeys.lists(), { filters }] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
  current: () => [...userKeys.all, "current"] as const,
} as const;

/*
 * ========================================
 * INVALIDATIONS
 * ========================================
 */
export const invalidations = {
  detail: (id: string) => [userKeys.current(), userKeys.detail(id)],
};

/*
 * ========================================
 * QUERIES
 * ========================================
 */
export const userQueries = {
  current: () => ({
    queryKey: userKeys.current(),
    queryFn: () => usersApi.getCurrentUser(),
    staleTime: 1000 * 60 * 10,
  }),
  detail: (userId: string) => ({
    queryKey: userKeys.detail(userId),
    queryFn: () => usersApi.getUserById(userId),
    enabled: !!userId,
  }),
};

/*
 * ========================================
 * REACT HOOKS
 * ========================================
 */
export function useCurrentUser() {
  return useQuery<UserResult, ApiClientError>({
    ...userQueries.current(),
  });
}

export function useUser(userId: string) {
  return useQuery<UserResult, ApiClientError>({
    ...userQueries.detail(userId),
  });
}

/*
 * ========================================
 * MUTATIONS
 * ========================================
 */
export interface UseUserMutationsOptions {
  onUpdateSuccess?: (data: UserResult) => void;
}

export const useUserMutations = (options?: UseUserMutationsOptions) => {
  const updateUser = useAppMutation<
    UserResult,
    ApiClientError,
    { userId: string; data: Partial<User> }
  >({
    mutationFn: ({ userId, data }) => usersApi.updateUser(userId, data),
    messages: {
      success: "Profile updated successfully!",
      error: (err) =>
        err.errors?.[0]?.detail ??
        "Failed to update profile. Please try again.",
    },
    invalidates: (variables) => invalidations.detail(variables.userId),
    onSuccess: options?.onUpdateSuccess,
  });

  return {
    updateUser,
  };
};

export function useUpdateUser(options?: UseUserMutationsOptions) {
  return useUserMutations(options).updateUser;
}
