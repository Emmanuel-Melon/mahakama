import en from "../../locales/en/corpus.json";
import ar from "../../locales/ar/corpus.json";
import type { I18nConfig } from "@mah/client/i18n";
import { defineRoutes } from "@mah/client/nav";

export const corpusRoutes = defineRoutes({
  index: { path: "corpus", file: "routes/corpus/index.tsx" },
});

export const CorpusPaths = corpusRoutes.to;

export const corpusI18n: I18nConfig<"corpus", typeof en> = {
  namespace: "corpus",
  resources: {
    en,
    ar,
  },
};
