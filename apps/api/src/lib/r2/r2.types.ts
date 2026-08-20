export interface UploadObjectOptions {
  key: string;
  body: Buffer | Uint8Array;
  contentType: string;
  metadata?: Record<string, string>;
}

export interface UploadObjectResult {
  key: string;
  bucket: string;
  publicUrl?: string;
}

export interface GetSignedUrlOptions {
  key: string;
  expiresInSeconds?: number;
}

export interface DeleteObjectOptions {
  key: string;
}
