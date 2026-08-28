import { useQuery } from "@tanstack/react-query";
import {
  consultationsApi,
  type ConsultationResult,
  type ConsultationsCollectionResponse,
  type ConsultationListParams,
  type NewConsultation,
  type DeclineConsultationPayload,
  type ConsultationsResult,
} from "../clients/consultations.api";
import type { ApiClientError } from "../api/api.errors";
import { useAppMutation } from "../react-query/react-query.utils";

export const consultationKeys = {
  all: ["consultations"] as const,
  lists: () => [...consultationKeys.all, "list"] as const,
  list: (filters: ConsultationListParams) =>
    [...consultationKeys.lists(), { filters }] as const,
  details: () => [...consultationKeys.all, "detail"] as const,
  detail: (id: string) => [...consultationKeys.details(), id] as const,
} as const;

/*
 * ========================================
 * INVALIDATIONS
 * ========================================
 */
export const invalidations = {
  detail: (id: string) => [
    consultationKeys.lists(),
    consultationKeys.detail(id),
  ],
};

/*
 * ========================================
 * QUERIES
 * ========================================
 */
export const consultationQueries = {
  list: (params: ConsultationListParams = {}) => ({
    queryKey: consultationKeys.list(params),
    queryFn: () => consultationsApi.getConsultations(params),
  }),
  detail: (consultationId: string) => ({
    queryKey: consultationKeys.detail(consultationId),
    queryFn: () => consultationsApi.getConsultationById(consultationId),
    enabled: !!consultationId,
  }),
};

/*
 * ========================================
 * REACT HOOKS
 * ========================================
 */
export function useConsultations(params: ConsultationListParams = {}) {
  return useQuery<ConsultationsResult, ApiClientError>({
    ...consultationQueries.list(params),
  });
}

export function useConsultation(consultationId: string) {
  return useQuery<ConsultationResult, ApiClientError>({
    ...consultationQueries.detail(consultationId),
  });
}

/*
 * ========================================
 * MUTATIONS
 * ========================================
 */
export interface UseConsultationMutationsOptions {
  onRequestSuccess?: (data: ConsultationResult) => void;
  onAcceptSuccess?: (data: ConsultationResult) => void;
  onDeclineSuccess?: (data: ConsultationResult) => void;
}

export const useConsultationMutations = (
  options?: UseConsultationMutationsOptions,
) => {
  const requestConsultation = useAppMutation<
    ConsultationResult,
    ApiClientError,
    NewConsultation
  >({
    mutationFn: (data) => consultationsApi.requestConsultation(data),
    messages: {
      success: "Consultation request sent!",
      error: (err) =>
        err.errors?.[0]?.detail ??
        "Failed to send consultation request. Please try again.",
    },
    invalidates: () => [consultationKeys.lists()],
    onSuccess: options?.onRequestSuccess,
  });

  const acceptConsultation = useAppMutation<
    ConsultationResult,
    ApiClientError,
    { consultationId: string }
  >({
    mutationFn: ({ consultationId }) =>
      consultationsApi.acceptConsultation(consultationId),
    messages: {
      success: "Consultation accepted!",
      error: (err) =>
        err.errors?.[0]?.detail ??
        "Failed to accept consultation. Please try again.",
    },
    invalidates: (variables) => invalidations.detail(variables.consultationId),
    onSuccess: options?.onAcceptSuccess,
  });

  const declineConsultation = useAppMutation<
    ConsultationResult,
    ApiClientError,
    { consultationId: string; data: DeclineConsultationPayload }
  >({
    mutationFn: ({ consultationId, data }) =>
      consultationsApi.declineConsultation(consultationId, data),
    messages: {
      success: "Consultation declined.",
      error: (err) =>
        err.errors?.[0]?.detail ??
        "Failed to decline consultation. Please try again.",
    },
    invalidates: (variables) => invalidations.detail(variables.consultationId),
    onSuccess: options?.onDeclineSuccess,
  });

  return {
    requestConsultation,
    acceptConsultation,
    declineConsultation,
  };
};

export function useRequestConsultation(
  options?: UseConsultationMutationsOptions,
) {
  return useConsultationMutations(options).requestConsultation;
}
