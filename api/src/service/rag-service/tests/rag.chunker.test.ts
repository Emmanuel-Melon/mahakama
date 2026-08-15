import { describe, it, expect } from "vitest";
import { chunkDocument, splitIntoSections } from "../rag.chunker";

describe("splitIntoSections", () => {
  it("returns an empty array for text without section headers", () => {
    expect(
      splitIntoSections("Some plain paragraph text.\n\nNo numbered headers."),
    ).toEqual([]);
  });

  it("splits on legal section headers at line start", () => {
    const text =
      "Landlord and Tenant Act 2022\n\n" +
      "26. Increase of rent.\n\n" +
      "A landlord shall not increase rent more than once a year.\n\n" +
      "28. Security deposit.\n\n" +
      "A landlord may require a security deposit.";

    const sections = splitIntoSections(text);
    expect(sections).toHaveLength(2);
    expect(sections[0]).toEqual({
      section: "26",
      title: "Increase of rent.",
      content:
        "26. Increase of rent.\n\nA landlord shall not increase rent more than once a year.",
    });
    expect(sections[1]).toEqual({
      section: "28",
      title: "Security deposit.",
      content:
        "28. Security deposit.\n\nA landlord may require a security deposit.",
    });
  });
});

describe("chunkDocument", () => {
  it("returns no chunks for empty text", () => {
    expect(chunkDocument({ documentId: "doc-1", text: "" })).toEqual([]);
  });

  it("falls back to character-based splitting when no section headers exist", () => {
    const text = "The quick brown fox jumps over the lazy dog. ".repeat(50);
    const chunks = chunkDocument(
      { documentId: "doc-1", title: "My Act", text },
      { chunkSize: 100, overlapSize: 20 },
    );

    expect(chunks.length).toBeGreaterThan(1);
    for (const chunk of chunks) {
      expect(chunk.id).toMatch(/^doc-1-\d+$/);
      expect(chunk.title).toBe("My Act");
      expect(chunk.section).toBeUndefined();
      expect(chunk.content.length).toBeLessThanOrEqual(101);
    }
  });

  it("emits one chunk per short section, stamped with section and header", () => {
    const text =
      "26. Increase of rent.\n\n" +
      "A landlord shall not increase rent more than once a year.\n\n" +
      "28. Security deposit.\n\n" +
      "A landlord may require a security deposit of up to one month's rent.";

    const chunks = chunkDocument(
      { documentId: "doc-1", title: "Landlord and Tenant Act 2022", text },
      { chunkSize: 1000, overlapSize: 200 },
    );

    expect(chunks).toHaveLength(2);
    expect(chunks[0].id).toBe("doc-1-0");
    expect(chunks[0].section).toBe("Section 26");
    expect(chunks[0].content).toContain("26. Increase of rent.");
    expect(chunks[1].id).toBe("doc-1-1");
    expect(chunks[1].section).toBe("Section 28");
    expect(chunks[1].content).toContain("28. Security deposit.");
  });

  it("includes preamble text as a chunk without a section", () => {
    const text =
      "Landlord and Tenant Act 2022\n" +
      "This Act regulates landlord and tenant relationships.\n\n" +
      "26. Increase of rent.\n\n" +
      "A landlord shall not increase rent more than once a year.";

    const chunks = chunkDocument(
      { documentId: "doc-1", title: "Act", text },
      { chunkSize: 1000, overlapSize: 200 },
    );

    expect(chunks.length).toBeGreaterThanOrEqual(2);
    expect(chunks[0].section).toBeUndefined();
    expect(chunks[0].content).toContain("This Act regulates");
    expect(chunks[1].section).toBe("Section 26");
  });

  it("sub-chunks a long section, prepending the header to every sub-chunk", () => {
    const body = "A tenant may terminate the tenancy by giving notice. ".repeat(
      30,
    );
    const text = `32. Termination of tenancy.\n\n${body}`;

    const chunks = chunkDocument(
      { documentId: "doc-1", title: "Act", text },
      { chunkSize: 300, overlapSize: 50 },
    );

    expect(chunks.length).toBeGreaterThan(1);
    for (const chunk of chunks) {
      expect(chunk.section).toBe("Section 32");
      expect(chunk.content.startsWith("32. Termination of tenancy.")).toBe(
        true,
      );
    }
  });

  it("never lets overlap or splitting cross a section boundary", () => {
    const s24body = "The landlord shall maintain the premises. ".repeat(40);
    const s26body = "Rent may only be increased by written notice. ".repeat(40);
    const text = `24. Repairs and maintenance.\n\n${s24body}\n\n26. Increase of rent.\n\n${s26body}`;

    const chunks = chunkDocument(
      { documentId: "doc-1", title: "Act", text },
      { chunkSize: 500, overlapSize: 100 },
    );

    expect(chunks.length).toBeGreaterThan(4);
    for (const chunk of chunks) {
      if (chunk.section === "Section 24") {
        expect(chunk.content).toContain("Repairs and maintenance.");
        expect(chunk.content).not.toContain("written notice");
        expect(chunk.content).not.toContain("Increase of rent.");
      } else if (chunk.section === "Section 26") {
        expect(chunk.content).toContain("Increase of rent.");
        expect(chunk.content).not.toContain("maintain the premises");
      } else {
        throw new Error(`Unexpected section stamp: ${chunk.section}`);
      }
    }
  });
});
