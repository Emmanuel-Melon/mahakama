import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { usersApi, type User } from '~/lib/api/users.api';

export const userKeys = {
    all: ['users'] as const,
    lists: () => [...userKeys.all, 'list'] as const,
    list: (filters: string) => [...userKeys.lists(), { filters }] as const,
    details: () => [...userKeys.all, 'detail'] as const,
    detail: (id: string) => [...userKeys.details(), id] as const,
    current: () => [...userKeys.all, 'current'] as const,
};

export function useCurrentUser(token?: string) {
    return useQuery({
        queryKey: userKeys.current(),
        queryFn: async () => {
            if (!token) return null;
            return await usersApi.getCurrentUser({
                headers: { Authorization: `Bearer ${token}` },
            });
        },
        enabled: !!token,
        staleTime: 1000 * 60 * 10,
        meta: {
            errorToast: false,
        },
    });
}

export function useUser(userId: string, token?: string) {
    return useQuery({
        queryKey: userKeys.detail(userId),
        queryFn: async () => {
            return await usersApi.getUserById(userId, {
                headers: { Authorization: `Bearer ${token}` },
            });
        },
        enabled: !!userId && !!token,
        meta: {
            errorToast: true,
            errorMessage: 'Failed to load user',
        },
    });
}

export function useUpdateUser(token?: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ userId, data }: { userId: string; data: Partial<User> }) => {
            return await usersApi.updateUser(userId, data, {
                headers: { Authorization: `Bearer ${token}` },
            });
        },
        onSuccess: (data, variables) => {
            toast.success('Profile updated successfully!');
            queryClient.invalidateQueries({ queryKey: userKeys.current() });
        },
        onError: (error) => {
            toast.error('Failed to update profile. Please try again.');
            console.error('Update error:', error);
        },
    });
}