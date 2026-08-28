import type { authI18n } from "~/feature/auth/AuthConfig";
import type { corpusI18n } from "~/feature/corpus/CorpusConfig";
import type { dashboardI18n } from "~/feature/dashboard/DashboardConfig";
import type { lawyersI18n } from "~/feature/lawyers/LawyersConfig";
import commonEn from "~/locales/en/common.json";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "common";
    resources: {
      auth: typeof authI18n.resources.en;
      common: typeof commonEn;
      corpus: typeof corpusI18n.resources.en;
      dashboard: typeof dashboardI18n.resources.en;
      lawyers: typeof lawyersI18n.resources.en;
    };
  }
}
