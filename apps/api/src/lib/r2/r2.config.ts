import { servicesConfig } from "@/config";

export const R2Config = {
  accountId: servicesConfig.r2?.accountId,
  accessKeyId: servicesConfig.r2?.accessKeyId,
  secretAccessKey: servicesConfig.r2?.secretAccessKey,
  bucket: servicesConfig.r2?.bucket,
  endpoint: `https://${servicesConfig.r2?.accountId}.r2.cloudflarestorage.com`,
  publicBaseUrl: servicesConfig.r2?.publicBaseUrl,
  region: "auto",
  presignedUrlExpirySeconds: 60 * 60, // 1 hour
} as const;
