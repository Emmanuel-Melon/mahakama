import { describe, it, expect } from "vitest";
import { extractCitations } from "../rag.citations";

describe("extractCitations", () => {
  it("returns no citations for plain text without legal references", () => {
    const result = extractCitations(
      "A landlord should treat tenants fairly and communicate clearly.",
    );

    expect(result.hasCitation).toBe(false);
    expect(result.citations).toEqual([]);
  });

  it("detects an Act with year", () => {
    const result = extractCitations(
      "Under the Land Act, 2012, a tenant is protected.",
    );

    expect(result.hasCitation).toBe(true);
    expect(result.citations).toContain("Act, 2012");
  });

  it("detects an Act year without a comma", () => {
    const result = extractCitations(
      "Under Landlord and Tenant Act 2022, Section 3...",
    );

    expect(result.citations).toContain("Act 2022");
  });

  it("detects a Section reference with subsection", () => {
    const result = extractCitations(
      "Section 4(2) of the Land Act requires written notice.",
    );

    expect(result.citations).toContain("Section 4(2)");
  });

  it("detects a Section range", () => {
    const result = extractCitations("Sections 8-9 of the Act cover repairs.");

    expect(result.citations).toContain("Sections 8-9");
  });

  it("detects an Article reference", () => {
    const result = extractCitations("Article 237(2)(c) of the Constitution.");

    expect(result.citations).toContain("Article 237(2)(c)");
  });

  it("detects the shorthand 's.' form", () => {
    const result = extractCitations(
      "Per s. 3 of the Act, the tenant may terminate.",
    );

    expect(result.citations).toContain("s. 3");
  });

  it("detects a whole-instrument reference", () => {
    const result = extractCitations(
      "This is guaranteed by the Constitution of Uganda.",
    );

    expect(result.citations).toContain("Constitution of Uganda");
  });

  it("dedupes repeated citations and is case-insensitive", () => {
    const result = extractCitations(
      "Section 3 applies. section 3 again. Act 2022.",
    );

    expect(
      result.citations.filter((c) => c.toLowerCase() === "section 3"),
    ).toHaveLength(1);
  });
});
