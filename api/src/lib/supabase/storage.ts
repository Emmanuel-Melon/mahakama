import { supabase } from ".";

const LEGAL_DOCS_BUCKET = "legal_documents";
const DEV_BUCKET = "dev";

export async function uploadPublicDocument(
  fileBuffer: Buffer,
  originalName: string,
  mimeType: string,
) {
  // Use clean filename without timestamp
  const storagePath = `laws/${originalName}`;
  const { data, error } = await supabase.storage
    .from(LEGAL_DOCS_BUCKET)
    .upload(storagePath, fileBuffer, {
      contentType: mimeType,
      cacheControl: "3600",
      upsert: true,
    });
  if (error) throw error;
  const {
    data: { publicUrl },
  } = supabase.storage.from(LEGAL_DOCS_BUCKET).getPublicUrl(data.path);
  return { storagePath: data.path, publicUrl };
}

export async function getFileFromDevBucket(filePath: string) {
  const { data, error } = await supabase.storage
    .from(DEV_BUCKET)
    .download(filePath);

  if (error) throw error;
  return data;
}

export async function listAllBuckets() {
  const { data, error } = await supabase.storage.listBuckets();

  if (error) throw error;
  return data;
}

export async function listFilesInBucket(bucketName: string, prefix?: string) {
  const { data, error } = await supabase.storage.from(bucketName).list(prefix);

  if (error) throw error;
  return data;
}

export async function getPublicUrlFromBucket(
  bucketName: string,
  filePath: string,
) {
  const { data } = await supabase.storage
    .from(bucketName)
    .getPublicUrl(filePath);

  return data.publicUrl;
}

export async function uploadFileToBucket({
  bucketName,
  fileBuffer,
  fileName,
  mimeType,
  storagePath,
  cacheControl = "3600",
  upsert = true,
}: {
  bucketName: string;
  fileBuffer: Buffer;
  fileName: string;
  mimeType: string;
  storagePath?: string;
  cacheControl?: string;
  upsert?: boolean;
}) {
  const finalStoragePath = storagePath || `${Date.now()}-${fileName}`;

  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(finalStoragePath, fileBuffer, {
      contentType: mimeType,
      cacheControl,
      upsert,
    });

  if (error) throw error;

  const {
    data: { publicUrl },
  } = supabase.storage.from(bucketName).getPublicUrl(data.path);

  return {
    storagePath: data.path,
    publicUrl,
    fileName,
    mimeType,
    bucketName,
  };
}
