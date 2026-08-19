// packages/api/src/hooks/documents/use-documents.sse.ts
import { useCallback } from "react";
import { documentsApi } from "../../clients/documents.api";
import { documentsKeys } from "./use-documents";
import {
  getUploadKey,
  useUploadManager,
  type BaseUploadProgress,
} from "../use-upload-manager";

export type UploadProgress = BaseUploadProgress;
export type UploadState = Record<string, UploadProgress>;
{
  /* Re-exporting for backward compatibility if needed */
}
export { getUploadKey };

export function useUploadDocument() {
  // Explicitly pass BaseUploadProgress so status can be "uploading" | "completed" | "error"
  const {
    uploads,
    queryClient,
    initFile,
    updateFileProgress,
    clearUploads,
    isUploading,
    hasErrors,
  } = useUploadManager<BaseUploadProgress>(() => ({
    status: "uploading",
    percentage: 0,
  }));

  const upload = useCallback(
    async (files: File[]): Promise<boolean> => {
      let allSucceeded = true;

      for (const file of files) {
        const key = getUploadKey(file);
        initFile(key, file);

        try {
          await documentsApi.uploadDocument(
            file,
            { title: file.name },
            (event) => {
              if (event.type === "progress") {
                updateFileProgress(key, {
                  status: "uploading",
                  percentage: event.data.percentage,
                });
              } else if (event.type === "completed") {
                updateFileProgress(key, {
                  status: "completed",
                  percentage: 100,
                });
                queryClient.invalidateQueries({
                  queryKey: documentsKeys.documents(),
                });
              } else if (event.type === "error") {
                updateFileProgress(key, {
                  status: "error",
                  percentage: 0,
                  message: event.data.message,
                });
              }
            },
          );
        } catch (error) {
          allSucceeded = false;
          updateFileProgress(key, {
            status: "error",
            percentage: 0,
            message: error instanceof Error ? error.message : String(error),
          });
        }
      }
      return allSucceeded;
    },
    [initFile, updateFileProgress, queryClient],
  );

  return { uploads, upload, clearUploads, isUploading, hasErrors };
}
