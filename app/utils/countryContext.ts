import type { Country } from "../components/layouts/header";

const COUNTRY_STORAGE_KEY = "selectedCountry";

// Default to South Sudan if no country is selected
export const getSelectedCountry = (): Country => {
  if (typeof window === "undefined") {
    return { code: "SS", name: "South Sudan", flag: "🇸🇸" };
  }

  const saved = localStorage.getItem(COUNTRY_STORAGE_KEY);
  return saved
    ? JSON.parse(saved)
    : { code: "SS", name: "South Sudan", flag: "🇸🇸" };
};

export const saveSelectedCountry = (country: Country) => {
  localStorage.setItem(COUNTRY_STORAGE_KEY, JSON.stringify(country));
};
