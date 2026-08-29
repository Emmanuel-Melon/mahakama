export interface SelectOption {
  value: string;
  label: string;
}

export type EacCountryCode =
  | "UG"
  | "KE"
  | "TZ"
  | "RW"
  | "BI"
  | "SS"
  | "CD"
  | "SO";

// The EAC's eight partner states.
export const EAC_COUNTRIES: SelectOption[] = [
  { value: "UG", label: "Uganda" },
  { value: "KE", label: "Kenya" },
  { value: "TZ", label: "Tanzania" },
  { value: "RW", label: "Rwanda" },
  { value: "BI", label: "Burundi" },
  { value: "SS", label: "South Sudan" },
  { value: "CD", label: "DR Congo" },
  { value: "SO", label: "Somalia" },
];

// National bar / law society a lawyer would have been admitted through.
// Verified against the East Africa Law Society's list of national member
// bars. DRC and Somalia are the EAC's newest partner states and don't have
// a confirmed national bar entry yet — fill in once confirmed with
// legal/compliance rather than guessing.
export const ISSUING_AUTHORITIES_BY_COUNTRY: Record<
  EacCountryCode,
  SelectOption[]
> = {
  UG: [{ value: "uls", label: "Uganda Law Society" }],
  KE: [{ value: "lsk", label: "Law Society of Kenya" }],
  TZ: [
    { value: "tls", label: "Tanganyika Law Society" },
    { value: "zls", label: "Zanzibar Law Society" },
  ],
  RW: [{ value: "rba", label: "Rwanda Bar Association" }],
  BI: [{ value: "bba", label: "Burundi Bar Association" }],
  SS: [{ value: "ssbs", label: "South Sudan Bar Association" }],
  CD: [], // TODO: confirm DRC's national bar association
  SO: [], // TODO: confirm Somalia's national bar association
};

// Courts a lawyer practices before.
// NOTE: only Uganda's hierarchy (Supreme Court / Court of Appeal / High
// Court) has been verified. The others are placeholders following the same
// common-law-style structure and need sign-off from a legal SME before
// shipping — Burundi and DRC in particular use civil-law court naming that
// won't match this pattern.
export const JURISDICTIONS_BY_COUNTRY: Record<EacCountryCode, SelectOption[]> = {
  UG: [
    { value: "high-court", label: "High Court of Uganda" },
    { value: "court-of-appeal", label: "Court of Appeal of Uganda" },
    { value: "supreme-court", label: "Supreme Court of Uganda" },
  ],
  KE: [
    { value: "high-court", label: "High Court of Kenya" },
    { value: "court-of-appeal", label: "Court of Appeal of Kenya" },
    { value: "supreme-court", label: "Supreme Court of Kenya" },
  ],
  TZ: [
    { value: "high-court", label: "High Court of Tanzania" },
    { value: "court-of-appeal", label: "Court of Appeal of Tanzania" },
  ],
  RW: [
    { value: "high-court", label: "High Court of Rwanda" },
    { value: "supreme-court", label: "Supreme Court of Rwanda" },
  ],
  BI: [], // TODO: confirm Burundi's court structure (civil-law naming)
  SS: [
    { value: "high-court", label: "High Court of South Sudan" },
    { value: "supreme-court", label: "Supreme Court of South Sudan" },
  ],
  CD: [], // TODO: confirm DRC's court structure (civil-law naming)
  SO: [], // TODO: confirm Somalia's court structure
};

// Not country-dependent — same list regardless of where the lawyer practices.
export const LEGAL_SPECIALIZATIONS: SelectOption[] = [
  { value: "corporate", label: "Corporate & Commercial Law" },
  { value: "family", label: "Family Law" },
  { value: "criminal", label: "Criminal Law" },
  { value: "land", label: "Land & Property Law" },
  { value: "immigration", label: "Immigration Law" },
  { value: "labour", label: "Labour & Employment Law" },
  { value: "human-rights", label: "Human Rights Law" },
  { value: "tax", label: "Tax Law" },
  { value: "intellectual-property", label: "Intellectual Property Law" },
  { value: "constitutional", label: "Constitutional Law" },
];

export function isEacCountryCode(value: string): value is EacCountryCode {
  return EAC_COUNTRIES.some((country) => country.value === value);
}