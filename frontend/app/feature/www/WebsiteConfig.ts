import { defineRoutes } from "../../lib/nav/nav.paths";
import en from "../../locales/en/website.json";
import ar from "../../locales/ar/website.json";
import type { I18nConfig } from "~/lib/i18n/i18next.types";

export const websiteRoutes = defineRoutes({
  about: { path: "about", file: "routes/www/about.tsx" },
  contact: { path: "contact", file: "routes/www/contact.tsx" },
  legalHub: { path: "legal-hub", file: "routes/www/legal-hub.tsx" },
  serviceDetail: {
    path: "legal-hub/:serviceId",
    file: "routes/www/legal-hub/$serviceId.tsx",
  },
});

export const WebsitePaths = websiteRoutes.to;

export const websiteI18n: I18nConfig<"website", typeof en> = {
  namespace: "website",
  resources: {
    en,
    ar,
  },
};
