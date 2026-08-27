import { defineRoutes } from "../../lib/nav/nav.paths";
import en from "../../locales/en/consultations.json";
import ar from "../../locales/ar/consultations.json";
import type { I18nConfig } from "~/lib/i18n/i18next.types";

const API_V1 = "/api/v1";

export const consultationsRoutes = defineRoutes({
  index: {
    path: "consultations",
    file: "routes/consultations/consultations.index.tsx",
  },
  detail: {
    path: "consultations/:consultationId",
    file: "routes/consultations/$consultationId.tsx",
  },
});

export const ConsultationsPaths = consultationsRoutes.to;

export const CONSULTATIONS_API_ROUTES = {
  ROOT: `${API_V1}/consultations`,
  CONSULTATION: `${API_V1}/consultations/:consultationId`,
  ACCEPT: `${API_V1}/consultations/:consultationId/accept`,
  DECLINE: `${API_V1}/consultations/:consultationId/decline`,
  CLOSE: `${API_V1}/consultations/:consultationId/close`,
} as const;

export const consultationsI18n: I18nConfig<"consultations", typeof en> = {
  namespace: "consultations",
  resources: {
    en,
    ar,
  },
};
