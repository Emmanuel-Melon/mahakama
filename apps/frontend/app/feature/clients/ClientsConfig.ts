import { defineRoutes } from "@mah/client/nav";
import en from "../../locales/en/clients.json";
import ar from "../../locales/ar/clients.json";
import type { I18nConfig } from "@mah/client/i18n";

export const clientsRoutes = defineRoutes({
  index: {
    path: "clients",
    file: "routes/clients/index.tsx",
  },
});

export const ClientsPaths = clientsRoutes.to;

export const clientsI18n: I18nConfig<"clients", typeof en> = {
  namespace: "clients",
  resources: {
    en,
    ar,
  },
};
