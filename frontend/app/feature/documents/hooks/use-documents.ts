import { useQuery } from "@tanstack/react-query";
import { documentsApi } from "~/lib/api/documents.api";
import type { components } from "~/lib/api/generated/api.types";

export type Document = components["schemas"]["Document"];
export type DocumentResource = components["schemas"]["DocumentResource"];
export type DocumentSingleResponse =
  components["schemas"]["DocumentSingleResponse"];
export type DocumentsCollectionResponse =
  components["schemas"]["DocumentsCollectionResponse"];
export type JsonApiErrorResponse =
  components["schemas"]["JsonApiErrorResponse"];

export const documentsKeys = {
  all: ["documents"],
  documents: () => [...documentsKeys.all, "documents"],
  document: (id: string | number) => [...documentsKeys.all, "document", id],
} as const;

export function useDocuments() {
  return useQuery<Document[], JsonApiErrorResponse>({
    queryKey: documentsKeys.documents(),
    queryFn: async () => {
      return await documentsApi.getDocuments();
    },
    meta: {
      errorToast: true,
      errorMessage: "Failed to load documents",
    },
  });
}

export function useDocument(id: string | number) {
  return useQuery<Document, JsonApiErrorResponse>({
    queryKey: documentsKeys.document(id),
    queryFn: async () => {
      return await documentsApi.getDocumentById(id);
    },
    enabled: !!id,
    meta: {
      errorToast: true,
      errorMessage: "Failed to load document",
    },
  });
}
