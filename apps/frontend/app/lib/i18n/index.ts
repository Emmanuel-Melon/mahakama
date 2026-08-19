import i18n from "i18next";
import type { Resource } from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import { authI18n } from "~/feature/auth/AuthConfig";
import { chatsI18n } from "~/feature/chats/ChatsConfig";
import { corpusI18n } from "~/feature/corpus/CorpusConfig";
import { lawyersI18n } from "~/feature/lawyers/LawyersConfig";
import { notificationsI18n } from "~/feature/notifications/NotificationsConfig";
import { usersI18n } from "~/feature/users/UsersConfig";
import { websiteI18n } from "~/feature/www/WebsiteConfig";

import commonAr from "~/locales/ar/common.json";
import commonEn from "~/locales/en/common.json";

const i18nConfigs = [
  authI18n,
  chatsI18n,
  corpusI18n,
  lawyersI18n,
  notificationsI18n,
  usersI18n,
  websiteI18n,
];

const resources: Resource = i18nConfigs.reduce<Resource>(
  (acc, Config) => {
    acc.en[Config.namespace] = Config.resources.en;
    acc.ar[Config.namespace] = Config.resources.ar;
    return acc;
  },
  {
    ar: { common: commonAr },
    en: { common: commonEn },
  },
);

i18n
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

export default i18n;
