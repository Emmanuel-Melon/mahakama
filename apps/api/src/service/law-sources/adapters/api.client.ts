import { logger } from "@/lib/logger";
import {
  LawSourceClient,
  LawDocumentRef,
  SourceCheck,
} from "../law-source.types";

const FETCH_TIMEOUT_MS = 15_000;

/**
 * Shape of a ULII-style act entry. The concrete API may differ — the adapter
 * normalizes any list to this shape defensively.
 */
interface SourceAct {
  id?: string;
  title: string;
  url?: string;
  lastUpdated?: string | null; // ISO/YYYY-MM-DD of the latest amendment
}

const normalizeTitle = (title: string) =>
  title.toLowerCase().replace(/[^a-z0-9]+/g, "");

/**
 * API adapter (metadata-updates.md U3.1): polls a configured law-source API
 * (e.g. ULII) for the full act list, then diffs each entry against our
 * tracked documents by source URL or normalized title. Entries not in our
 * table are reported as `new-act`; matched entries with a newer amendment
 * date are reported as `reingest`. No-op (never registered) when unconfigured
 * — see `getLawSourceClients()`.
 */
export class UlIiApiLawSourceClient implements LawSourceClient {
  readonly name = "ulii-api";

  constructor(
    private readonly baseUrl: string,
    private readonly apiKey?: string,
  ) {}

  async check(documents: LawDocumentRef[]): Promise<SourceCheck[]> {
    const acts = await this.fetchActs();
    const results: SourceCheck[] = [];

    for (const act of acts) {
      if (!act.title) continue;

      const match = documents.find(
        (doc) =>
          (doc.sourceUrl && act.url && doc.sourceUrl === act.url) ||
          normalizeTitle(doc.title) === normalizeTitle(act.title),
      );

      const detected = this.normalizeDate(act.lastUpdated);

      if (!match) {
        results.push({
          client: this.name,
          documentId: null,
          title: act.title,
          sourceUrl: act.url,
          detectedLastUpdated: detected,
          action: "new-act",
          detail: "Listed by the law source but not tracked in documents",
        });
        continue;
      }

      const changed =
        detected !== null &&
        (!match.lastUpdated || detected > match.lastUpdated);
      results.push({
        client: this.name,
        documentId: match.id,
        title: act.title,
        sourceUrl: act.url,
        detectedLastUpdated: detected,
        previousLastUpdated: match.lastUpdated ?? undefined,
        action: changed ? "reingest" : "no-change",
        detail: changed ? undefined : "No newer amendment date detected",
      });
    }

    return results;
  }

  private async fetchActs(): Promise<SourceAct[]> {
    const response = await fetch(`${this.baseUrl}/acts`, {
      headers: this.apiKey
        ? { Authorization: `Bearer ${this.apiKey}` }
        : undefined,
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    if (!response.ok) {
      throw new Error(`Law source API responded with HTTP ${response.status}`);
    }

    const body: unknown = await response.json();
    const list = Array.isArray(body)
      ? body
      : Array.isArray((body as { acts?: unknown }).acts)
        ? (body as { acts: unknown[] }).acts
        : Array.isArray((body as { data?: unknown }).data)
          ? (body as { data: unknown[] }).data
          : [];

    if (list.length === 0) {
      logger.warn(
        { client: this.name, baseUrl: this.baseUrl },
        "Law source API returned an empty act list",
      );
    }

    return list as SourceAct[];
  }

  /** Normalize any reasonable date string to `YYYY-MM-DD`; null when unknown. */
  private normalizeDate(value?: string | null): string | null {
    if (!value) return null;
    const iso = value.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
    if (iso) {
      return `${iso[1]}-${iso[2].padStart(2, "0")}-${iso[3].padStart(2, "0")}`;
    }
    return null;
  }
}
