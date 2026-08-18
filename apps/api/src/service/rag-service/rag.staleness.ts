// Pure staleness logic (metadata-updates.md U4.1). A chunk is stale when:
// 1. a newer version of its document exists in `documents` (version bump from
//    a U3 diff check / re-ingest), or
// 2. its `last_updated` date is older than the staleness window
//    (default 24 months, configurable via RAG_STALENESS_MONTHS).
// Fail-open: chunks without enough information are never flagged.

import { ChunkStalenessInput } from "./rag.types";
import { RAG_STALENESS_CONFIG } from "./rag.config";

export const isChunkStale = (input: ChunkStalenessInput): boolean => {
  // Newer document version exists → stale regardless of age.
  if (
    input.version !== undefined &&
    input.currentVersion !== undefined &&
    input.version < input.currentVersion
  ) {
    return true;
  }

  // No amendment date → cannot judge age → not stale (fail-open).
  if (!input.lastUpdated) return false;

  const parsed = new Date(input.lastUpdated);
  if (Number.isNaN(parsed.getTime())) return false;

  const now = input.now ?? new Date();
  const cutoff = new Date(now);
  cutoff.setMonth(
    cutoff.getMonth() -
      (input.stalenessMonths ?? RAG_STALENESS_CONFIG.DEFAULT_STALENESS_MONTHS),
  );

  return parsed < cutoff;
};
