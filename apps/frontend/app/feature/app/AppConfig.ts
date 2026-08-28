import en from "../../locales/en/app.json";
import ar from "../../locales/ar/app.json";
import type { I18nConfig } from "@mah/client/i18n";

export const appI18n: I18nConfig<"app", typeof en> = {
  namespace: "app",
  resources: {
    en,
    ar,
  },
};
