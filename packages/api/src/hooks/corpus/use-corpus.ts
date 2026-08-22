import { useQuery } from "@tanstack/react-query";
import {
  corpusApi,
  type Corpus,
  type CorpusCollection,
} from "../../clients/corpus.api";
import type { ApiClientError } from "../../api/api.errors";

export const corpusKeys = {
  all: ["corpus"] as const,
  entries: () => [...corpusKeys.all, "entries"] as const,
  entry: (id: string | number) => [...corpusKeys.all, "entry", id] as const,
} as const;

/*
 * ========================================
 * QUERIES
 * ========================================
 */
export const corpusQueries = {
  entries: () => ({
    queryKey: corpusKeys.entries(),
    queryFn: () => corpusApi.getCorpusEntries(),
  }),
  entry: (id: string | number) => ({
    queryKey: corpusKeys.entry(id),
    queryFn: async () => {
      const result = await corpusApi.getCorpusEntryById(id);
      return result.data as unknown as Corpus;
    },
    enabled: !!id,
  }),
};

export function useCorpusEntries() {
  return useQuery<CorpusCollection, ApiClientError>(corpusQueries.entries());
}

export function useCorpusEntry(id: string | number) {
  return useQuery<Corpus, ApiClientError>(corpusQueries.entry(id));
}
