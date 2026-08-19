import { defineRoutes } from "../../lib/nav/nav.paths";
import en from "../../locales/en/corpus.json";
import ar from "../../locales/ar/corpus.json";
import type { I18nConfig } from "~/lib/i18n/i18next.types";

export const corpusRoutes = defineRoutes({
  index: { path: "documents", file: "routes/corpus/index.tsx" },
  detail: {
    path: "documents/:documentId",
    file: "routes/corpus/$corpusId.tsx",
  },
});

export const CorpusPaths = corpusRoutes.to;

export const corpusI18n: I18nConfig<"documents", typeof en> = {
  namespace: "documents",
  resources: {
    en,
    ar,
  },
};
