import i18n from "i18next";
import type { Resource } from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import { authI18n } from "~/feature/auth/AuthConfig";

import commonEn from "~/locales/en/common.json";

const i18nConfigs = [authI18n];

const resources: Resource = i18nConfigs.reduce<Resource>(
  (acc, Config) => {
    acc.en[Config.namespace] = Config.resources.en;
    return acc;
  },
  {
    en: { common: commonEn },
  },
);

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    supportedLngs: ["en"],
    defaultNS: "common",
    ns: Object.keys(resources.en).sort(),
    resources,
    detection: {
      order: ["cookie", "localStorage", "navigator"],
      caches: ["cookie", "localStorage"],
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
