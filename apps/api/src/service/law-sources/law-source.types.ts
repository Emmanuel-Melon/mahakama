// Law source diff-check contract (metadata-updates.md U3).
//
// A `LawSourceClient` inspects external law sources (ULII API, ULII HTML pages,
// ...) and reports whether any tracked document has been amended since our
// stored metadata says so. The scheduled job (law-sources.jobs.ts) turns the
// reported `action` into a version bump + re-ingest.

export interface LawDocumentRef {
  id: string;
  title: string;
  sourceUrl?: string | null;
  lastUpdated?: string | null; // stored YYYY-MM-DD
}

export type LawSourceAction =
  | "no-change"
  | "reingest" // stored date differs from source — re-ingest with bumped version
  | "new-act" // source lists an act we don't track yet
  | "detection-failed"; // could not read a date from the source

export interface SourceCheck {
  client: string;
  documentId: string | null; // null when the source reported an untracked act
  title: string;
  sourceUrl?: string;
  detectedLastUpdated: string | null; // YYYY-MM-DD, null when unknown
  previousLastUpdated?: string;
  action: LawSourceAction;
  detail?: string;
}

export interface LawSourceClient {
  readonly name: string;
  check(documents: LawDocumentRef[]): Promise<SourceCheck[]>;
}
