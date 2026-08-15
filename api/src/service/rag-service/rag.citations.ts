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

// Cross-checks extracted citations against the set of full citations that were
// actually retrieved for the answer. A citation is trusted when it equals or is
// contained in one of the retrieved full citations (case-insensitive), so
// "Section 26" passes when "Landlord and Tenant Act 2022, Section 26" was in
// the context, while a free-generated "Section 3" is flagged as fabricated.
export const filterCitationsAgainstWhitelist = (
  citations: string[],
  whitelist: string[],
): { valid: string[]; fabricated: string[] } => {
  if (!whitelist.length) {
    return { valid: [], fabricated: citations };
  }

  const normalizedWhitelist = whitelist.map((entry) => entry.toLowerCase());
  const valid: string[] = [];
  const fabricated: string[] = [];

  for (const citation of citations) {
    const normalized = citation.toLowerCase();
    const isKnown = normalizedWhitelist.some(
      (entry) => entry === normalized || entry.includes(normalized),
    );
    (isKnown ? valid : fabricated).push(citation);
  }

  return { valid, fabricated };
};
