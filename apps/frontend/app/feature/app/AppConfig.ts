import en from "../../locales/en/app.json";
import ar from "../../locales/ar/app.json";
import type { I18nConfig } from "~/lib/i18n/i18next.types";

export const appI18n: I18nConfig<"app", typeof en> = {
  namespace: "app",
  resources: {
    en,
    ar,
  },
};
