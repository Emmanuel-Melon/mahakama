import { defineRoutes } from "../../lib/nav/nav.paths";
import en from "../../locales/en/lawyers.json";
import ar from "../../locales/ar/lawyers.json";
import type { I18nConfig } from "~/lib/i18n/i18next.types";

export const lawyersRoutes = defineRoutes({
  index: { path: "lawyers", file: "routes/lawyers/index.tsx" },
  detail: { path: "lawyers/:lawyerId", file: "routes/lawyers/$lawyerId.tsx" },
});

export const LawyersPaths = lawyersRoutes.to;

export const lawyersI18n: I18nConfig<"lawyers", typeof en> = {
  namespace: "lawyers",
  resources: {
    en,
    ar,
  },
};
