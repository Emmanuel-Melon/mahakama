import type { dashboardI18n } from "~/feature/dashboard/DashboardConfig";
import commonEn from "~/locales/en/common.json";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "common";
    resources: {
      common: typeof commonEn;
      dashboard: typeof dashboardI18n.resources.en;
    };
  }
}