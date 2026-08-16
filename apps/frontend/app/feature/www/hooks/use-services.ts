import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { servicesApi } from "~/lib/api/services.api";

import type { components } from "~/lib/api/generated/api.types";

export type LegalService = components["schemas"]["LegalService"];
export type LegalServiceResource =
  components["schemas"]["LegalServiceResource"];
export type LegalServiceSingleResponse =
  components["schemas"]["LegalServiceSingleResponse"];
export type LegalServicesCollectionResponse =
  components["schemas"]["LegalServicesCollectionResponse"];
export type JsonApiErrorResponse =
  components["schemas"]["JsonApiErrorResponse"];

export const servicesKeys = {
  all: ["services"] as const,
  services: () => [...servicesKeys.all, "services"] as const,
  service: (id: string) => [...servicesKeys.all, "service", id] as const,
  servicesByCategory: (category: string) =>
    [...servicesKeys.all, "services", "category", category] as const,
};

export function useServices(
  category?: "government" | "legal-aid" | "dispute-resolution" | "specialized",
) {
  return useQuery<LegalService[], JsonApiErrorResponse>({
    queryKey: category
      ? servicesKeys.servicesByCategory(category)
      : servicesKeys.services(),
    queryFn: async () => {
      return await servicesApi.getServices(category);
    },
    meta: {
      errorToast: true,
      errorMessage: "Failed to load services",
    },
  });
}

export function useService(id: string) {
  return useQuery<LegalService, JsonApiErrorResponse>({
    queryKey: servicesKeys.service(id),
    queryFn: async () => {
      return await servicesApi.getServiceById(id);
    },
    enabled: !!id,
    meta: {
      errorToast: true,
      errorMessage: "Failed to load service",
    },
  });
}
