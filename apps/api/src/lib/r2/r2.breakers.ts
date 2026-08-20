import { logger } from "@/lib/logger";
import { createBreaker } from "@/lib/opossum";

import { deleteObject, uploadObject } from "./r2.core";

const R2_ERROR_FILTER = (err: unknown): boolean => {
  const isS3Error = (
    e: any,
  ): e is { name: string; $metadata?: { httpStatusCode: number } } => {
    return typeof e === "object" && e !== null;
  };

  if (isS3Error(err)) {
    const isNotFound =
      err.name === "NoSuchKey" || err.$metadata?.httpStatusCode === 404;
    return !isNotFound;
  }

  return true;
};

const R2_CONFIG = {
  timeout: 10_000,
  errorThresholdPercentage: 50,
  volumeThreshold: 5,
  errorFilter: R2_ERROR_FILTER,
  service: "storage" as const,
};

/*
 * ==========================================
 * BREAKER REGISTRY
 * ==========================================
 */
export const r2Breakers = {
  deleteObject: createBreaker(deleteObject, "r2.deleteObject", R2_CONFIG),
  uploadObject: createBreaker(uploadObject, "r2.uploadObject", {
    ...R2_CONFIG,
    timeout: 15_000,
  }),
};

/*
 * ==========================================
 * BREAKER FACADE
 * ==========================================
 */
export const r2 = {
  deleteObject: (options: Parameters<typeof deleteObject>[0]) =>
    r2Breakers.deleteObject.fire(options),

  uploadObject: (options: Parameters<typeof uploadObject>[0]) =>
    r2Breakers.uploadObject.fire(options),
};

/*
 * ==========================================
 * BREAKER FALLBACKS
 * ==========================================
 */
r2Breakers.deleteObject.fallback((options) => {
  logger.error(
    { options },
    "R2 deleteObject breaker OPEN - operation rejected",
  );
  throw new Error(
    "Storage service is temporarily unavailable. Please try again later.",
  );
});

r2Breakers.uploadObject.fallback((options) => {
  logger.warn({ options }, "R2 uploadObject breaker OPEN - returning null");
  return null;
});
