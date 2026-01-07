import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { lawyersApi } from '~/lib/api/lawyers.api';

import type { components as componentsv1 } from "~/lib/api/generated/api.types";

export type AuthResponse = componentsv1["schemas"]["AuthResponse"];
export type JsonApiErrorResponse = componentsv1["schemas"]["JsonApiErrorResponse"];
export type Lawyer = componentsv1["schemas"]["Lawyer"];
export type CreateLawyer = componentsv1["schemas"]["CreateLawyer"];

export const lawyersKeys = {
    all: ['lawyers'] as const,
    lawyers: () => [...lawyersKeys.all, 'lawyers'] as const,
    lawyer: (id: string) => [...lawyersKeys.all, 'lawyer', id] as const,
};

export function useLawyers(
    filters?: {
        specialization?: string;
        location?: string;
        available?: boolean;
        q?: string;
    }
) {
    return useQuery<Lawyer[], JsonApiErrorResponse>({
        queryKey: filters ? [...lawyersKeys.lawyers(), 'filters', filters] : lawyersKeys.lawyers(),
        queryFn: async () => {
            return await lawyersApi.getLawyers(filters)
        },
        meta: {
            errorToast: true,
            errorMessage: 'Failed to load lawyers',
        },
    });
}

export function useLawyer(id: string) {
    return useQuery<Lawyer, JsonApiErrorResponse>({
        queryKey: lawyersKeys.lawyer(id),
        queryFn: async () => {
            return await lawyersApi.getLawyerById(id);
        },
        enabled: !!id,
        meta: {
            errorToast: true,
            errorMessage: 'Failed to load lawyer',
        },
    });
}

export function useCreateLawyer() {
    const queryClient = useQueryClient();

    return useMutation<Lawyer, JsonApiErrorResponse, CreateLawyer>({
        mutationFn: async (lawyerData: CreateLawyer) => {
            return await lawyersApi.createLawyer(lawyerData);
        },
        onSuccess: (data) => {
            toast.success('Lawyer created successfully!');
            queryClient.invalidateQueries({ queryKey: lawyersKeys.lawyers() });
        },
        onError: (error) => {
            toast.error('Failed to create lawyer. Please try again.');
            console.error('Create lawyer error:', error);
        },
    });
}

