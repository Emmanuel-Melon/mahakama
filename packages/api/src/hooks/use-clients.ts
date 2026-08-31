import { useQuery } from "@tanstack/react-query";
import {
  clientsApi,
  type ClientCollection,
  type ClientListParams,
} from "../clients/clients.api";
import type { ApiClientError } from "../api/api.errors";

export const clientKeys = {
  all: ["clients"] as const,
  lists: () => [...clientKeys.all, "list"] as const,
  list: (filters: ClientListParams | undefined) =>
    [...clientKeys.lists(), { filters }] as const,
} as const;

export const clientQueries = {
  list: (filters?: ClientListParams) => ({
    queryKey: clientKeys.list(filters),
    queryFn: () => clientsApi.getClients(filters),
  }),
};

export function useClients(filters?: ClientListParams) {
  return useQuery<ClientCollection, ApiClientError>({
    ...clientQueries.list(filters),
  });
}
