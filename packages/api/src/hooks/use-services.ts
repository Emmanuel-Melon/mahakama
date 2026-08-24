import { useQuery } from "@tanstack/react-query";
import {
  servicesApi,
  type LegalServiceCollection,
  type LegalServiceResult,
} from "../clients/services.api";
import type { ApiClientError } from "../api/api.errors";

export const servicesKeys = {
  all: ["services"] as const,
  services: () => [...servicesKeys.all, "services"] as const,
  service: (id: string) => [...servicesKeys.all, "service", id] as const,
  servicesByCategory: (category: string) =>
    [...servicesKeys.all, "services", "category", category] as const,
} as const;

/*
 * ========================================
 * QUERIES
 * ========================================
 */
export const servicesQueries = {
  services: (
    category?:
      "government" | "legal-aid" | "dispute-resolution" | "specialized",
  ) => ({
    queryKey: category
      ? servicesKeys.servicesByCategory(category)
      : servicesKeys.services(),
    queryFn: () => servicesApi.getServices(category),
  }),
  service: (id: string) => ({
    queryKey: servicesKeys.service(id),
    queryFn: () => servicesApi.getServiceById(id),
    enabled: !!id,
  }),
};

export function useServices(
  category?: "government" | "legal-aid" | "dispute-resolution" | "specialized",
) {
  return useQuery<LegalServiceCollection, ApiClientError>(
    servicesQueries.services(category),
  );
}

export function useService(id: string) {
  return useQuery<LegalServiceResult, ApiClientError>(
    servicesQueries.service(id),
  );
}
