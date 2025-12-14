import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { lawyersApi } from '~/lib/api/lawyers.api';

import type { components } from "~/lib/api/generated/api.types";
import type { components as componentsv1} from "~/lib/api/generated/api1.types";

export type AuthResponse = componentsv1["schemas"]["AuthResponse"];
export type JsonApiErrorResponse = componentsv1["schemas"]["JsonApiErrorResponse"];
export type Lawyer = components["schemas"]["Lawyer"];

export const lawyersKeys = {
    all: ['lawyers'] as const,
    lawyers: () => [...lawyersKeys.all, 'lawyers'] as const,
    lawyer: (id: string) => [...lawyersKeys.all, 'lawyer', id] as const,
};

export function useLawyers() {
    return useQuery<Lawyer[], JsonApiErrorResponse>({
        queryKey: lawyersKeys.lawyers(),
        queryFn: async () => {
            return await lawyersApi.getLawyers()
        }
    });
}

export function useLawyer(id: string) {
    return useQuery<Lawyer, JsonApiErrorResponse>({
        queryKey: lawyersKeys.lawyer(id),
        queryFn: async () => {
            return await lawyersApi.getLawyerById(id);
        },
        enabled: !!id,
    });
}

