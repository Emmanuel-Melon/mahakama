import { useCallback } from "react";
import {
  documentsApi,
  type SessionDocumentEvent,
} from "../../clients/documents.api";
import { documentsKeys } from "./use-documents";
import {
  getUploadKey,
  useUploadManager,
  type BaseUploadProgress,
} from "../use-upload-manager";

export type DocumentUploadProgress = BaseUploadProgress & {
  totalChunks?: number;
};
export type DocumentUploadState = Record<string, DocumentUploadProgress>;
export { getUploadKey as getDocumentUploadKey };

export function useUploadDocument() {
  const {
    uploads,
    queryClient,
    initFile,
    updateFileProgress,
    clearUploads,
    isUploading,
    hasErrors,
  } = useUploadManager<DocumentUploadProgress>(() => ({
    status: "uploading",
    percentage: 0,
  }));

  const upload = useCallback(
    async (sessionId: string, file: File): Promise<boolean> => {
      const key = getUploadKey(file);
      initFile(key, file);

      try {
        await documentsApi.uploadDocument(
          sessionId,
          file,
          (event: SessionDocumentEvent) => {
            if (event.type === "progress") {
              updateFileProgress(key, {
                status: "uploading",
                percentage: event.data.percentage,
                totalChunks: event.data.totalChunks,
              });
            } else if (event.type === "completed") {
              updateFileProgress(key, {
                status: "completed",
                percentage: 100,
                totalChunks: event.data.totalChunks,
              });
              queryClient.invalidateQueries({
                queryKey: documentsKeys.status(sessionId),
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
        return true;
      } catch (error) {
        updateFileProgress(key, {
          status: "error",
          percentage: 0,
          message: error instanceof Error ? error.message : String(error),
        });
        return false;
      }
    },
    [initFile, updateFileProgress, queryClient],
  );

  const uploadProgress = Object.values(uploads)[0]?.percentage ?? 0;

  return {
    uploads,
    upload,
    clearUploads,
    isUploading,
    hasErrors,
    uploadProgress,
  };
}
