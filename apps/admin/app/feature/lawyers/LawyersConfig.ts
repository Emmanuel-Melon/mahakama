import en from "../../locales/en/lawyers.json";
import ar from "../../locales/ar/lawyers.json";
import type { I18nConfig } from "@mah/client/i18n";
import { defineRoutes } from "@mah/client/nav";

export const lawyersRoutes = defineRoutes({
  index: { path: "lawyer-profiles", file: "routes/lawyer-profiles/index.tsx" },
  detail: {
    path: "lawyer-profiles/:lawyerId",
    file: "routes/lawyer-profiles/$lawyerId.tsx",
  },
});

export const LawyersPaths = lawyersRoutes.to;

export const lawyersI18n: I18nConfig<"lawyers", typeof en> = {
  namespace: "lawyers",
  resources: {
    en,
    ar,
  },
};
