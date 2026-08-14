import { describe, it, expect, vi, beforeEach } from "vitest";
import { ragService } from "../rag.service";

vi.mock("@/service/embedding-service/embeddings.search", () => ({
  searchEmbedding: vi.fn(),
}));

import { searchEmbedding } from "@/service/embedding-service/embeddings.search";

const mockedSearch = vi.mocked(searchEmbedding);

const chromaHit = (
  id: string,
  title: string,
  distance: number,
  extra: Record<string, unknown> = {},
) => ({
  id,
  title,
  distance,
  extra,
});

describe("ragService.retrieveContext", () => {
  const collectionName = "legal_questions";

  const buildResults = (hits: ReturnType<typeof chromaHit>[]) => ({
    ids: [hits.map((h) => h.id)],
    documents: [hits.map((h) => `${h.title}. Provision text for ${h.title}`)],
    metadatas: [
      hits.map((h) => ({
        title: h.title,
        section: "Section 1",
        category: "Citizenship",
        source: "Constitution of Uganda",
        ...h.extra,
      })),
    ],
    distances: [hits.map((h) => h.distance)],
  });

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("returns empty context when there are no hits", async () => {
    mockedSearch.mockResolvedValue({} as never);

    const result = await ragService.retrieveContext("some question", {
      collectionName,
    });

    expect(result).toEqual({ chunks: [], sources: [] });
  });

  it("filters out results below the similarity threshold", async () => {
    mockedSearch.mockResolvedValue(
      buildResults([
        chromaHit("law_1", "Citizenship by Birth", 0.05), // similarity 0.95 — kept
        chromaHit("law_2", "Tax Evasion", 0.9), // similarity 0.10 — dropped
      ]) as never,
    );

    const result = await ragService.retrieveContext("citizenship question", {
      collectionName,
    });

    expect(result.chunks).toHaveLength(1);
    expect(result.chunks[0].title).toBe("Citizenship by Birth");
  });

  it("maps chunks and dedupes sources by title+section", async () => {
    mockedSearch.mockResolvedValue(
      buildResults([
        chromaHit("law_1", "Citizenship by Birth", 0.1),
        chromaHit("law_2", "Citizenship by Birth", 0.15),
        chromaHit("law_3", "Dual Citizenship", 0.2),
      ]) as never,
    );

    const result = await ragService.retrieveContext("citizenship question", {
      collectionName,
    });

    expect(result.chunks).toHaveLength(3);
    expect(result.sources).toHaveLength(2);
    expect(result.sources.map((s) => s.title)).toEqual([
      "Citizenship by Birth",
      "Dual Citizenship",
    ]);
    expect(result.sources[0]).toMatchObject({
      category: "Citizenship",
      source: "Constitution of Uganda",
      section: "Section 1",
    });
  });

  it("strips the leading title from stored document text", async () => {
    mockedSearch.mockResolvedValue(
      buildResults([chromaHit("law_1", "Citizenship by Birth", 0.1)]) as never,
    );

    const result = await ragService.retrieveContext("citizenship question", {
      collectionName,
    });

    expect(result.chunks[0].content).toBe("Provision text for Citizenship by Birth");
  });

  it("honours topK and minSimilarity options", async () => {
    mockedSearch.mockResolvedValue(
      buildResults([chromaHit("law_1", "One", 0.1)]) as never,
    );

    await ragService.retrieveContext("q", {
      collectionName,
      topK: 3,
      minSimilarity: 0.99,
    });

    expect(mockedSearch).toHaveBeenCalledWith("q", {
      collectionName,
      limit: 3,
    });
  });

  it("throws on an invalid (too short) query", async () => {
    await expect(
      ragService.retrieveContext("ab", { collectionName }),
    ).rejects.toThrow();
    expect(mockedSearch).not.toHaveBeenCalled();
  });
});
