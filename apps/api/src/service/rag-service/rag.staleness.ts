// Pure staleness logic (metadata-updates.md U4.1). A chunk is stale when:
//  1. a newer version of its document exists in `documents` (version bump from
//     a U3 diff check / re-ingest), or
//  2. its `last_updated` date is older than the staleness window
//     (default 24 months, configurable via RAG_STALENESS_MONTHS).
// Fail-open: chunks without enough information are never flagged.

export const DEFAULT_STALENESS_MONTHS = 24;

export interface ChunkStalenessInput {
  version?: number; // chunk's own version (from Chroma metadata)
  documentId?: string;
  lastUpdated?: string; // YYYY-MM-DD or ISO
  currentVersion?: number; // the document's current version in the DB
  now?: Date;
  stalenessMonths?: number;
}

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
    cutoff.getMonth() - (input.stalenessMonths ?? DEFAULT_STALENESS_MONTHS),
  );

  return parsed < cutoff;
};
