import { describe, it, expect } from "vitest";
import { isChunkStale } from "../rag.staleness";
import { RAG_STALENESS_CONFIG } from "../rag.config";

const now = new Date("2026-08-15T00:00:00Z");

describe("isChunkStale", () => {
  it("flags chunks whose document has a newer version", () => {
    expect(
      isChunkStale({
        version: 1,
        documentId: "doc-1",
        currentVersion: 2,
        now,
      }),
    ).toBe(true);
  });

  it("does not flag chunks at the current version", () => {
    expect(
      isChunkStale({
        version: 2,
        documentId: "doc-1",
        currentVersion: 2,
        now,
      }),
    ).toBe(false);
  });

  it("flags chunks older than the staleness window", () => {
    expect(
      isChunkStale({
        lastUpdated: "2020-01-01",
        stalenessMonths: RAG_STALENESS_CONFIG.DEFAULT_STALENESS_MONTHS,
        now,
      }),
    ).toBe(true);
  });

  it("keeps chunks inside the window fresh", () => {
    expect(
      isChunkStale({
        lastUpdated: "2026-01-01",
        stalenessMonths: RAG_STALENESS_CONFIG.DEFAULT_STALENESS_MONTHS,
        now,
      }),
    ).toBe(false);
  });

  it("uses a custom staleness window", () => {
    // 25 months ago: stale under a 24-month window, fresh under 30.
    expect(
      isChunkStale({ lastUpdated: "2024-06-01", stalenessMonths: 24, now }),
    ).toBe(true);
    expect(
      isChunkStale({ lastUpdated: "2024-06-01", stalenessMonths: 30, now }),
    ).toBe(false);
  });

  it("fails open when there is not enough information", () => {
    expect(isChunkStale({})).toBe(false);
    expect(isChunkStale({ lastUpdated: "not-a-date", now })).toBe(false);
    expect(isChunkStale({ lastUpdated: undefined, version: 1, now })).toBe(
      false,
    );
  });
});
