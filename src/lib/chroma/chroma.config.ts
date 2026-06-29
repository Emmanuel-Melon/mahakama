export const COLLECTION_NAME = "legal_questions";

// Map category names between questions and laws
export const CATEGORY_MAP: Record<string, string[]> = {
  Citizenship: ["Citizenship"],
  Rights: ["Human Rights"],
  Property: ["Land"],
  Housing: ["Housing"],
  Employment: ["Employment"],
  General: ["General", "Voting & Elections", "Environment", "Legislation"],
};
