import type { Matter } from "@mah/api/src/clients/matters.api";

export const getMetadataRecord = (
  metadata: unknown,
): Record<string, unknown> => {
  if (
    typeof metadata === "object" &&
    metadata !== null &&
    !Array.isArray(metadata)
  ) {
    return metadata as Record<string, unknown>;
  }
  return {};
};

export const isMatterPrepared = (attrs?: Matter): boolean =>
  Boolean(getMetadataRecord(attrs?.metadata).readyAt);
