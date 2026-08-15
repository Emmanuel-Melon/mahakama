import { lawSourcesConfig } from "@/config";
import { LawSourceClient } from "./law-source.types";
import { HtmlLawSourceClient } from "./adapters/html.client";
import { UlIiApiLawSourceClient } from "./adapters/api.client";

/**
 * Registered law source clients (metadata-updates.md U3.3). Returns an empty
 * list — and the scheduled diff job becomes a no-op — until
 * `LAW_SOURCES_ENABLED=true` is set. The API adapter additionally needs
 * `ULII_BASE_URL`; the HTML adapter works for any document with a `sourceUrl`.
 */
export const getLawSourceClients = (): LawSourceClient[] => {
  if (!lawSourcesConfig.enabled) return [];

  const clients: LawSourceClient[] = [];
  if (lawSourcesConfig.uliiBaseUrl) {
    clients.push(
      new UlIiApiLawSourceClient(
        lawSourcesConfig.uliiBaseUrl,
        lawSourcesConfig.uliiApiKey,
      ),
    );
  }
  clients.push(new HtmlLawSourceClient());
  return clients;
};
