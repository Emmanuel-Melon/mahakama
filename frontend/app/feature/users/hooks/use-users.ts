import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { usersApi } from '~/lib/api/users.api';

import type { components as componentsv1 } from "~/lib/api/generated/api.types";
export type JsonApiErrorResponse = componentsv1["schemas"]["JsonApiErrorResponse"];
export type User = componentsv1["schemas"]["User"];

export const userKeys = {
    all: ['users'] as const,
    lists: () => [...userKeys.all, 'list'] as const,
    list: (filters: string) => [...userKeys.lists(), { filters }] as const,
    details: () => [...userKeys.all, 'detail'] as const,
    detail: (id: string) => [...userKeys.details(), id] as const,
    current: () => [...userKeys.all, 'current'] as const,
};

export function useCurrentUser() {
    return useQuery<User | null, JsonApiErrorResponse>({
        queryKey: userKeys.current(),
        queryFn: async () => {
            return await usersApi.getCurrentUser();
        },
        staleTime: 1000 * 60 * 10,
        meta: {
            errorToast: false,
        },
    });
}

export function useUser(userId: string) {
    return useQuery<User, JsonApiErrorResponse>({
        queryKey: userKeys.detail(userId),
        queryFn: async () => {
            return await usersApi.getUserById(userId);
        },
        enabled: !!userId,
        meta: {
            errorToast: true,
            errorMessage: 'Failed to load user',
        },
    });
}

export function useUpdateUser() {
    const queryClient = useQueryClient();

    return useMutation<User, JsonApiErrorResponse, { userId: string; data: Partial<User> }>({
        mutationFn: async ({ userId, data }) => {
            return await usersApi.updateUser(userId, data);
        },
        onSuccess: (data, variables) => {
            toast.success('Profile updated successfully!');
            queryClient.invalidateQueries({ queryKey: userKeys.current() });
            if (data.isOnboarded) {
                window.location.href = '/app';
            }
        },
        onError: (error) => {
            toast.error('Failed to update profile. Please try again.');
            console.error('Update error:', error);
        },
    });
}