import { createHash } from "crypto";
import { randomBytes } from "crypto";

export const hashToken = (token: string): string => {
  return createHash("sha256").update(token).digest("hex");
};

export const generateOpaqueToken = (
  bytes = 32,
): { rawToken: string; tokenHash: string } => {
  const rawToken = randomBytes(bytes).toString("hex");
  const tokenHash = hashToken(rawToken);
  return { rawToken, tokenHash };
};
