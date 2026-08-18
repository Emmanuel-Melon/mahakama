export const CITATION_PATTERNS = [
  /Act,? \d{4}/, // "Land Act, 2012", "Landlord and Tenant Act 2022"
  /Article \d+[A-Za-z0-9().-]*/, // "Article 10", "Article 237(2)(c)"
  /Sections? \d+(?:[-–]\d+)?[A-Za-z0-9().-]*/, // "Section 3", "Sections 8-9", "Section 4(2)"
  /s\.\s?\d+[A-Za-z0-9().-]*/, // "s. 3", "s.3(1)"
  /Constitution of Uganda/, // whole-instrument reference
];

export const RAG_CONTEXT_CONFIG = {
  COLLECTION_NAME: "legal_questions",
  TOP_K: 5,
  RELEVANCE_THRESHOLD: 0.7,
  HISTORY_LIMIT: 10,
} as const;
