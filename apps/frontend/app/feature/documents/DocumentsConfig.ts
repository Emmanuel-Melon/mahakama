import { defineRoutes } from "../../lib/nav/nav.paths";
import en from "../../locales/en/documents.json";
import ar from "../../locales/ar/documents.json";
import type { I18nConfig } from "~/lib/i18n/i18next.types";

export const documentsRoutes = defineRoutes({
  index: { path: "documents", file: "routes/documents/index.tsx" },
  detail: {
    path: "documents/:documentId",
    file: "routes/documents/$documentId.tsx",
  },
});

export const DocumentsPaths = documentsRoutes.to;

export const documentsI18n: I18nConfig<"documents", typeof en> = {
  namespace: "documents",
  resources: {
    en,
    ar,
  },
};
