import i18n, { type Resource } from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import type { I18nConfig } from "./i18n.types";

interface CreateI18nOptions {
  configs: I18nConfig<string, unknown>[];
  common: { en: Record<string, unknown>; ar: Record<string, unknown> };
}

export function createI18n({ configs, common }: CreateI18nOptions) {
  const resources: Resource = configs.reduce<Resource>(
    (acc, config) => {
      acc.en[config.namespace] = config.resources.en as object;
      acc.ar[config.namespace] = config.resources.ar as object;
      return acc;
    },
    {
      en: { common: common.en },
      ar: { common: common.ar },
    },
  );

  const instance = i18n.createInstance();

  instance
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      fallbackLng: "en",
      supportedLngs: ["en", "ar"],
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

  return instance;
}
