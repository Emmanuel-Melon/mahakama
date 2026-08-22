import { useQuery } from "@tanstack/react-query";
import {
  lawyersApi,
  type LawyerCollection,
  type CreateLawyerRequest,
  type LawyerResult,
} from "../clients/lawyers.api";
import type { ApiClientError } from "../api/api.errors";
import { useAppMutation } from "../react-query/react-query.utils";

export const lawyersKeys = {
  all: ["lawyers"] as const,
  lawyers: () => [...lawyersKeys.all, "lawyers"] as const,
  lawyer: (id: string) => [...lawyersKeys.all, "lawyer", id] as const,
} as const;

/*
 * ========================================
 * QUERIES
 * ========================================
 */
export const lawyersQueries = {
  lawyers: (filters?: {
    specialization?: string;
    location?: string;
    available?: boolean;
    q?: string;
  }) => ({
    queryKey: filters
      ? [...lawyersKeys.lawyers(), "filters", filters]
      : lawyersKeys.lawyers(),
    queryFn: () => lawyersApi.getLawyers(filters),
  }),
  lawyer: (id: string) => ({
    queryKey: lawyersKeys.lawyer(id),
    queryFn: () => lawyersApi.getLawyerById(id),
    enabled: !!id,
  }),
};

export function useLawyers(filters?: {
  specialization?: string;
  location?: string;
  available?: boolean;
  q?: string;
}) {
  return useQuery<LawyerCollection, ApiClientError>(
    lawyersQueries.lawyers(filters),
  );
}

export function useLawyer(id: string) {
  return useQuery<LawyerResult, ApiClientError>(lawyersQueries.lawyer(id));
}

/*
 * ========================================
 * MUTATIONS
 * ========================================
 */
export function useCreateLawyer() {
  return useAppMutation<LawyerResult, ApiClientError, CreateLawyerRequest>({
    mutationFn: (lawyerData) => lawyersApi.createLawyer(lawyerData),
    messages: {
      success: "Lawyer created successfully!",
      error: (err) =>
        err.errors?.[0]?.detail ?? "Failed to create lawyer. Please try again.",
    },
    invalidates: [lawyersKeys.lawyers()],
  });
}
