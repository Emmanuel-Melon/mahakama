// packages/api/src/hooks/use-upload-manager.ts
import { useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

export type UploadStatus = "uploading" | "completed" | "error";

export type BaseUploadProgress = {
  status: UploadStatus;
  percentage: number;
  message?: string;
  totalChunks?: number;
};

export type UploadState<T extends BaseUploadProgress = BaseUploadProgress> =
  Record<string, T>;

/**
 * Stable key per file to prevent collisions between same-named files.
 */
export const getUploadKey = (file: File): string =>
  `${file.name}|${file.lastModified}|${file.size}`;

/**
 * Generic factory/hook to manage file upload queue states, progress tracking, and error handlers.
 */
export function useUploadManager<
  TProgress extends BaseUploadProgress = BaseUploadProgress,
>(initialProgressState: (file: File) => TProgress) {
  const [uploads, setUploads] = useState<UploadState<TProgress>>({});
  const queryClient = useQueryClient();

  const updateFileProgress = useCallback(
    (key: string, update: Partial<TProgress>) => {
      setUploads((prev) => ({
        ...prev,
        [key]: {
          ...prev[key],
          ...update,
        },
      }));
    },
    [],
  );

  const initFile = useCallback(
    (key: string, file: File) => {
      setUploads((prev) => ({
        ...prev,
        [key]: initialProgressState(file),
      }));
    },
    [initialProgressState],
  );

  const clearUploads = useCallback(() => setUploads({}), []);

  const isUploading = Object.values(uploads).some(
    (progress) => progress.status === "uploading",
  );
  const hasErrors = Object.values(uploads).some(
    (progress) => progress.status === "error",
  );

  return {
    uploads,
    queryClient,
    initFile,
    updateFileProgress,
    clearUploads,
    isUploading,
    hasErrors,
  };
}
