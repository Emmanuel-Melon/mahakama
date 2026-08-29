import { defineRoutes } from "@mah/client/nav";
import en from "../../locales/en/matters.json";
import ar from "../../locales/ar/matters.json";
import type { I18nConfig } from "@mah/client/i18n";

const API_V1 = "/api/v1";

export const mattersRoutes = defineRoutes({
  index: {
    path: "matters",
    file: "routes/matters/index.tsx",
  },
  detail: {
    path: "matters/:matterId",
    file: "routes/matters/$matterId.tsx",
  },
});

export const MattersPaths = mattersRoutes.to;

export const MATTERS_API_ROUTES = {
  ROOT: `${API_V1}/matters`,
  TIMELINE: `${API_V1}/matters/:matterId/timeline`,
  NOTES: `${API_V1}/matters/:matterId/notes`,
  LAWYERS: `${API_V1}/matters/:matterId/lawyers`,
  LAWYERS_ME: `${API_V1}/matters/:matterId/lawyers/me`,
} as const;

export const mattersI18n: I18nConfig<"matters", typeof en> = {
  namespace: "matters",
  resources: {
    en,
    ar,
  },
};