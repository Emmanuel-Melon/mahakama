// Pure helpers for scraping "last updated" dates from law-source HTML pages
// (metadata-updates.md U3.1). Kept side-effect free so they are unit-testable.

const MONTHS: Record<string, string> = {
  jan: "01",
  feb: "02",
  mar: "03",
  apr: "04",
  may: "05",
  jun: "06",
  jul: "07",
  aug: "08",
  sep: "09",
  oct: "10",
  nov: "11",
  dec: "12",
};

const pad2 = (value: string) => value.padStart(2, "0");

/** Parse a date fragment into `YYYY-MM-DD`, or null when it is not a date. */
export const parseDateToken = (raw: string): string | null => {
  const iso = raw.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (iso) {
    return `${iso[1]}-${pad2(iso[2])}-${pad2(iso[3])}`;
  }

  const dmy = raw.match(/(\d{1,2})\s+([a-z]{3,9})\.?\s*,?\s*(\d{4})/i);
  if (dmy) {
    const month = MONTHS[dmy[2].toLowerCase().slice(0, 3)];
    if (month) {
      return `${dmy[3]}-${month}-${pad2(dmy[1])}`;
    }
  }

  const numeric = raw.match(/(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})/);
  if (numeric) {
    return `${numeric[3]}-${pad2(numeric[2])}-${pad2(numeric[1])}`;
  }

  return null;
};

/**
 * Scan an HTML document for a "Last updated: <date>" footer and return the
 * first parseable date as `YYYY-MM-DD`, or null when none is found.
 */
export const scrapeLastUpdated = (html: string): string | null => {
  const mentions = html.toLowerCase().split("last updated");
  for (let i = 1; i < mentions.length; i++) {
    // Footer labels like "Last updated: 12 January 2024 by ..." — the date
    // sits right after the label, so a short window is plenty.
    const candidate = mentions[i].slice(0, 120);
    const parsed = parseDateToken(candidate);
    if (parsed) return parsed;
  }
  return null;
};
