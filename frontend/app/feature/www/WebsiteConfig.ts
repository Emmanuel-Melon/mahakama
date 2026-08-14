import { defineRoutes } from "../../lib/nav/nav.paths";

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
