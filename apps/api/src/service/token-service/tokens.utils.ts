// apps/api/src/workflows/access/tokens.utils.ts
import { createHash, createHmac, randomInt } from "crypto";

import type { CodeFormatConfig } from "./tokens.types";

export const DEFAULT_CODE_FORMAT: CodeFormatConfig = {
  alphabet: "ABCDEFGHJKLMNPQRSTUVWXYZ23456789", // Excludes confusing characters like I, O, 0, 1
  length: 12,
  groups: 3,
  separator: "-",
};

/**
 * Normalizes a human-readable code: uppercase, strips whitespace, dashes, and common separators.
 */
export function normalizeCode(code: string): string {
  return code
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, "");
}

/**
 * Generates a human-readable random code and formats it into groups (e.g., ABC-DEF-GHI).
 */
export function generateHumanCode(
  config: CodeFormatConfig = DEFAULT_CODE_FORMAT,
): {
  code: string;
  display: string;
} {
  const { alphabet, length, groups, separator } = config;
  const alphabetLength = alphabet.length;

  let rawCode = "";
  // Generate random characters from the alphabet using a CSPRNG
  for (let i = 0; i < length; i++) {
    const randomIndex = randomInt(alphabetLength);
    rawCode += alphabet[randomIndex];
  }

  const normalized = normalizeCode(rawCode);

  // Format into display groups
  const groupSize = Math.ceil(normalized.length / groups);
  const parts: string[] = [];
  for (let i = 0; i < normalized.length; i += groupSize) {
    parts.push(normalized.slice(i, i + groupSize));
  }
  const display = parts.join(separator);

  return {
    code: normalized,
    display,
  };
}

/**
 * Computes an HMAC-SHA256 hash for human-readable codes using a server secret pepper.
 * Makes offline brute-force attacks infeasible even if the database is leaked.
 */
export function hashCodeToken(code: string, pepper: string): string {
  const normalized = normalizeCode(code);
  return createHmac("sha256", pepper).update(normalized).digest("hex");
}

/**
 * Computes a standard SHA-256 hash for high-entropy opaque tokens (links).
 */
export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}
