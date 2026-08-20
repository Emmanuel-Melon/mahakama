import { S3Client } from "@aws-sdk/client-s3";

import { R2Config } from "./r2.config";

export const r2Client = new S3Client({
  region: R2Config.region,
  endpoint: R2Config.endpoint,
  credentials: {
    accessKeyId: R2Config.accessKeyId!,
    secretAccessKey: R2Config.secretAccessKey!,
  },
});
