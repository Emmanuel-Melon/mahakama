import { logger } from "@/lib/logger";
import {
  LawSourceClient,
  LawDocumentRef,
  SourceCheck,
} from "../law-source.types";
import { scrapeLastUpdated } from "../law-source.scrape";

const FETCH_TIMEOUT_MS = 15_000;

/**
 * HTML adapter (metadata-updates.md U3.1): fetches each document's source page
 * (e.g. a ULII act page) and scrapes its "Last Updated" footer, comparing it
 * against the stored `lastUpdated`. Documents without a `sourceUrl` are
 * skipped entirely — there is nothing to check.
 */
export class HtmlLawSourceClient implements LawSourceClient {
  readonly name = "ulii-html";

  async check(documents: LawDocumentRef[]): Promise<SourceCheck[]> {
    const results: SourceCheck[] = [];

    for (const doc of documents) {
      if (!doc.sourceUrl) continue;

      let html: string;
      try {
        const response = await fetch(doc.sourceUrl, {
          signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
        });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        html = await response.text();
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        logger.warn(
          {
            client: this.name,
            documentId: doc.id,
            sourceUrl: doc.sourceUrl,
            error: message,
          },
          "Law source page fetch failed",
        );
        results.push({
          client: this.name,
          documentId: doc.id,
          title: doc.title,
          sourceUrl: doc.sourceUrl,
          detectedLastUpdated: null,
          action: "detection-failed",
          detail: `Could not fetch page: ${message}`,
        });
        continue;
      }

      const detected = scrapeLastUpdated(html);
      if (!detected) {
        results.push({
          client: this.name,
          documentId: doc.id,
          title: doc.title,
          sourceUrl: doc.sourceUrl,
          detectedLastUpdated: null,
          action: "detection-failed",
          detail: "No 'last updated' date found on the page",
        });
        continue;
      }

      const changed = !doc.lastUpdated || detected !== doc.lastUpdated;
      results.push({
        client: this.name,
        documentId: doc.id,
        title: doc.title,
        sourceUrl: doc.sourceUrl,
        detectedLastUpdated: detected,
        previousLastUpdated: doc.lastUpdated ?? undefined,
        action: changed ? "reingest" : "no-change",
      });
    }

    return results;
  }
}
