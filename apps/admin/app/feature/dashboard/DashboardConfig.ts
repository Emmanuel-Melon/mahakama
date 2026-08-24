import en from "../../locales/en/dashboard.json";
import ar from "../../locales/ar/dashboard.json";
import type { I18nConfig } from "@mah/client/i18n";
import { defineRoutes } from "@mah/client/nav";

export const dashboardRoutes = defineRoutes({
  index: { path: "", file: "routes/dashboard/index.tsx" },
});

export const DashboardPaths = dashboardRoutes.to;

export const dashboardI18n: I18nConfig<"dashboard", typeof en> = {
  namespace: "dashboard",
  resources: {
    en,
    ar,
  },
};