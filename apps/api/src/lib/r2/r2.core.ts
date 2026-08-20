import { r2Client } from ".";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { R2Config } from "./r2.config";
import type {
  DeleteObjectOptions,
  GetSignedUrlOptions,
  UploadObjectOptions,
  UploadObjectResult,
} from "./r2.types";

export const uploadObject = async (
  options: UploadObjectOptions,
): Promise<UploadObjectResult> => {
  const { key, body, contentType, metadata } = options;

  await r2Client.send(
    new PutObjectCommand({
      Bucket: R2Config.bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
      Metadata: metadata,
    }),
  );

  return {
    key,
    bucket: R2Config.bucket!,
    publicUrl: R2Config.publicBaseUrl
      ? `${R2Config.publicBaseUrl}/${key}`
      : undefined,
  };
};

export const getSignedDownloadUrl = async (
  options: GetSignedUrlOptions,
): Promise<string> => {
  const { key, expiresInSeconds = R2Config.presignedUrlExpirySeconds } =
    options;
  const command = new GetObjectCommand({
    Bucket: R2Config.bucket,
    Key: key,
  });
  return await getSignedUrl(r2Client, command, {
    expiresIn: expiresInSeconds,
  });
};

export const deleteObject = async (
  options: DeleteObjectOptions,
): Promise<void> => {
  const { key } = options;

  await r2Client.send(
    new DeleteObjectCommand({
      Bucket: R2Config.bucket,
      Key: key,
    }),
  );
};
