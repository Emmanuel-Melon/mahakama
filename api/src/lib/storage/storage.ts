import fs from "fs";
import path from "path";
import { storageConfig, serverConfig } from "@/config";

export const SAMPLES_DIR = path.join(storageConfig.dir, "samples");

export function ensureStorageDir(): void {
  fs.mkdirSync(storageConfig.dir, { recursive: true });
  fs.mkdirSync(SAMPLES_DIR, { recursive: true });
}

function sanitizeFileName(fileName: string): string {
  return path.basename(fileName).replace(/[^a-zA-Z0-9._-]/g, "-");
}

export function saveUploadedFile({
  buffer,
  fileName,
  mimeType,
}: {
  buffer: Buffer;
  fileName: string;
  mimeType: string;
}): { storagePath: string; publicUrl: string } {
  ensureStorageDir();
  const storedName = `${Date.now()}-${sanitizeFileName(fileName)}`;
  const storagePath = path.join(storageConfig.dir, storedName);
  fs.writeFileSync(storagePath, buffer);
  return {
    storagePath,
    publicUrl: `${serverConfig.baseUrl}/uploads/${storedName}`,
  };
}

export function getStoragePath(urlOrPath: string): string {
  let relative = urlOrPath;

  if (relative.startsWith(serverConfig.baseUrl)) {
    relative = relative.slice(serverConfig.baseUrl.length);
  }

  if (/^https?:\/\//i.test(relative)) {
    throw new Error(
      `Cannot resolve external URL to local storage: ${urlOrPath}`,
    );
  }

  relative = relative.replace(/^\/+/, "");

  const storageDirPrefix = `${storageConfig.dir}/`;
  if (relative.startsWith(storageDirPrefix)) {
    relative = relative.slice(storageDirPrefix.length);
  } else if (relative === storageConfig.dir) {
    relative = "";
  }

  const storageRoot = path.resolve(storageConfig.dir);
  const resolved = path.resolve(storageRoot, relative);

  if (resolved !== storageRoot && !resolved.startsWith(`${storageRoot}${path.sep}`)) {
    throw new Error(`Invalid storage path: ${urlOrPath}`);
  }

  return resolved;
}

export function readStoredFile(urlOrPath: string): Buffer {
  return fs.readFileSync(getStoragePath(urlOrPath));
}
