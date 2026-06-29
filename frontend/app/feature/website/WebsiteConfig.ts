export const WEBSITE_ROUTES = {
  LAYOUT: "./feature/website/layouts/website.layout.tsx",
  ABOUT: {
    URL_SEGMENT: "about",
    PATH: "routes/about.tsx",
    NAME: "about",
    LABEL: "About",
  },
  CONTACT: {
    URL_SEGMENT: "contact",
    PATH: "routes/contact.tsx",
    NAME: "contact",
    LABEL: "Contact",
  },
  LEGAL_HUB: {
    URL_SEGMENT: "legal-hub",
    PATH: "routes/legal-hub.tsx",
    NAME: "legalHub",
    LABEL: "Legal Hub",
  },
  SERVICE_DETAIL: {
    URL_SEGMENT: "legal-hub/:serviceId",
    PATH: "routes/legal-hub/$serviceId.tsx",
    NAME: "serviceDetail",
    LABEL: "Service Details",
  },
} as const;
