import { JsonApiResourceConfig } from "@/lib/express/express.types";
import { corpusSelectSchema, type Corpus } from "./corpus.types";

export const CorpusSerializer: JsonApiResourceConfig<Corpus> = {
  type: "corpus",
  attributes: (corpus: Corpus) => corpusSelectSchema.parse(corpus),
};

export const CorpusRagCollections = {
  CorpusSummaries: {
    label: "summary",
  },
};

export const CorpusJobs = {
  CorpusUploaded: "corpus-uploaded",
} as const;

export type CorpusJobType = (typeof CorpusJobs)[keyof typeof CorpusJobs];

// for pagination and route queries
export const sortableFields = [
  "createdAt",
  "updatedAt",
  "title",
  "downloadCount",
] as const;
export const searchableFields = ["title", "description", "type"] as const;
export type SearchableField = (typeof searchableFields)[number];
export type SortableField = (typeof sortableFields)[number];

export const CORPUS_CONFIG = {
  COLLECTION_NAME: "legal_questions",
  CONTENT_PREVIEW_LENGTH: 200,
} as const;
