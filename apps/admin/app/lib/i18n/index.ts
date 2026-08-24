import { createI18n } from "@mah/client/i18n";
import { dashboardI18n } from "~/feature/dashboard/DashboardConfig";
import commonEn from "~/locales/en/common.json";
import commonAr from "~/locales/ar/common.json";

const i18n = createI18n({
  configs: [dashboardI18n],
  common: { en: commonEn, ar: commonAr },
});

export default i18n;