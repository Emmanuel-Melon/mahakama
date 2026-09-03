import en from "../../locales/en/orgs.json";
import ar from "../../locales/ar/orgs.json";
import type { I18nConfig } from "@mah/client/i18n";
import { defineRoutes } from "@mah/client/nav";

export const orgsRoutes = defineRoutes({
  index: { path: "orgs", file: "routes/orgs/index.tsx" },
});

export const OrgsPaths = orgsRoutes.to;

export const orgsI18n: I18nConfig<"orgs", typeof en> = {
  namespace: "orgs",
  resources: {
    en,
    ar,
  },
};