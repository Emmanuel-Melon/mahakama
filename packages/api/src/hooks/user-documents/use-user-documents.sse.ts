// packages/api/src/hooks/user-documents/use-user-documents.sse.ts
import { useCallback } from "react";
import {
  userDocumentsApi,
  type UserDocumentEvent,
} from "../../clients/user-documents.api";
import { userDocumentsKeys } from "./use-user-documents";
import {
  getUploadKey,
  useUploadManager,
  type BaseUploadProgress,
} from "../use-upload-manager";

export type UserDocumentUploadProgress = BaseUploadProgress & {
  totalChunks?: number;
};
export type UserDocumentUploadState = Record<
  string,
  UserDocumentUploadProgress
>;
export { getUploadKey as getUserDocumentUploadKey };

export function useUploadUserDocument() {
  const {
    uploads,
    queryClient,
    initFile,
    updateFileProgress,
    clearUploads,
    isUploading,
    hasErrors,
  } = useUploadManager<UserDocumentUploadProgress>(() => ({
    status: "uploading",
    percentage: 0,
  }));

  const upload = useCallback(
    async (sessionId: string, file: File): Promise<boolean> => {
      const key = getUploadKey(file);
      initFile(key, file);

      try {
        await userDocumentsApi.uploadUserDocument(
          sessionId,
          file,
          (event: UserDocumentEvent) => {
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
                queryKey: userDocumentsKeys.status(sessionId),
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
