import { useQuery } from "@tanstack/react-query";
import { documentsApi, type Document } from "../../clients/documents.api";
import type { ApiClientError } from "../../api/api.errors";

export const documentsKeys = {
  all: ["documents"] as const,
  documents: () => [...documentsKeys.all, "documents"] as const,
  document: (id: string | number) =>
    [...documentsKeys.all, "document", id] as const,
} as const;

/*
 * ========================================
 * QUERIES
 * ========================================
 */
export const documentsQueries = {
  documents: () => ({
    queryKey: documentsKeys.documents(),
    queryFn: () => documentsApi.getDocuments(),
  }),
  document: (id: string | number) => ({
    queryKey: documentsKeys.document(id),
    // Extract the inner document data if your ApiResource wraps it,
    // or adjust based on how unpackSingle maps your resource.
    queryFn: async () => {
      const result = await documentsApi.getDocumentById(id);
      return result.data as unknown as Document; // Adjust property accessor if your resource uses a different key name
    },
    enabled: !!id,
  }),
};

export function useDocuments() {
  return useQuery<Document[], ApiClientError>(documentsQueries.documents());
}

export function useDocument(id: string | number) {
  return useQuery<Document, ApiClientError>(documentsQueries.document(id));
}
