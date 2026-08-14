import { useCallback, useState } from "react";
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

export type UploadProgress = {
  status: "uploading" | "completed" | "error";
  percentage: number;
  message?: string;
};

export type UploadState = Record<string, UploadProgress>;

// Stable key per file so same-named files don't collide in the uploads map.
export const getUploadKey = (file: File): string =>
  `${file.name}|${file.lastModified}|${file.size}`;

export function useUploadDocument() {
  const [uploads, setUploads] = useState<UploadState>({});

  const upload = useCallback(async (files: File[]): Promise<boolean> => {
    let allSucceeded = true;
    for (const file of files) {
      const key = getUploadKey(file);
      setUploads((prev) => ({
        ...prev,
        [key]: { status: "uploading", percentage: 0 },
      }));
      try {
        await documentsApi.uploadDocument(
          file,
          { title: file.name },
          (event) => {
            if (event.type === "progress") {
              setUploads((prev) => ({
                ...prev,
                [key]: {
                  status: "uploading",
                  percentage: event.data.percentage,
                },
              }));
            } else if (event.type === "completed") {
              setUploads((prev) => ({
                ...prev,
                [key]: { status: "completed", percentage: 100 },
              }));
            } else if (event.type === "error") {
              setUploads((prev) => ({
                ...prev,
                [key]: {
                  status: "error",
                  percentage: 0,
                  message: event.data.message,
                },
              }));
            }
          },
        );
      } catch (error) {
        allSucceeded = false;
        setUploads((prev) => ({
          ...prev,
          [key]: {
            status: "error",
            percentage: 0,
            message: error instanceof Error ? error.message : String(error),
          },
        }));
      }
    }
    return allSucceeded;
  }, []);

  const clearUploads = useCallback(() => setUploads({}), []);

  const isUploading = Object.values(uploads).some(
    (progress) => progress.status === "uploading",
  );
  const hasErrors = Object.values(uploads).some(
    (progress) => progress.status === "error",
  );

  return { uploads, upload, clearUploads, isUploading, hasErrors };
}

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
