// Post-generation citation validation (see citations.md C4). Scans a generated
// answer for citation patterns so a missing citation can be flagged rather
// than silently shipped.

const CITATION_PATTERNS = [
  /Act,? \d{4}/, // "Land Act, 2012", "Landlord and Tenant Act 2022"
  /Article \d+[A-Za-z0-9().-]*/, // "Article 10", "Article 237(2)(c)"
  /Sections? \d+(?:[-–]\d+)?[A-Za-z0-9().-]*/, // "Section 3", "Sections 8-9", "Section 4(2)"
  /s\.\s?\d+[A-Za-z0-9().-]*/, // "s. 3", "s.3(1)"
  /Constitution of Uganda/, // whole-instrument reference
];

export type CitationScan = {
  citations: string[];
  hasCitation: boolean;
};

export const extractCitations = (text: string): CitationScan => {
  // Keyed by lowercase so repeated citations dedupe case-insensitively while
  // the first-seen casing is preserved.
  const seen = new Map<string, string>();

  for (const pattern of CITATION_PATTERNS) {
    const regex = new RegExp(pattern.source, "gi");
    for (const match of text.matchAll(regex)) {
      const citation = match[0].trim();
      if (citation) {
        seen.set(citation.toLowerCase(), citation);
      }
    }
  }

  return {
    citations: Array.from(seen.values()),
    hasCitation: seen.size > 0,
  };
};
