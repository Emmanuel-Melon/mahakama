import { serverConfig } from "@/config";
import { getStoragePath } from "@/lib/storage/storage";
import { statSync } from "fs";

export function formatStorageUrl(storageUrl: string): string {
  if (!/^https?:\/\//i.test(storageUrl)) {
    return storageUrl.startsWith("/")
      ? `${serverConfig.baseUrl}${storageUrl}`
      : `https://${storageUrl}`;
  }
  return storageUrl;
}

export function isExternalStorageUrl(storageUrl: string): boolean {
  return (
    /^https?:\/\//i.test(storageUrl) &&
    !storageUrl.startsWith(serverConfig.baseUrl)
  );
}

export function getDocumentFileSize(storageUrl: string): number {
  if (isExternalStorageUrl(storageUrl)) {
    return 0;
  }

  try {
    const localPath = getStoragePath(storageUrl);
    return statSync(localPath).size;
  } catch {
    // File missing on disk — return 0; the worker will fail loudly.
    return 0;
  }
}
