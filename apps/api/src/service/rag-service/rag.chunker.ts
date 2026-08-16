import type { DocumentChunk } from "@/service/embedding-service/embeddings.types";

export type FileContent = {
  documentId: string;
  text: string;
  title?: string;
};

type ChunkingOptions = {
  chunkSize: number; // characters
  overlapSize: number;
};

const DEFAULT_CHUNK_SIZE = 1000;
const DEFAULT_OVERLAP_SIZE = 200;
// How far back from the hard chunk boundary we search for a word break,
// as a fraction of chunkSize.
const WORD_BOUNDARY_TOLERANCE = 0.2;

const WORD_BOUNDARY = /\s/;

// Split on legal section headers like "26. Increase of rent." at line start.
const SECTION_HEADER = /^\s*(\d{1,3})\.\s+([A-Z][^\n]+)\n/gm;

// Non-global variant used to locate the first header (global regexes carry
// `lastIndex` state, which would make `search` unreliable).
const SECTION_HEADER_FIRST = /^\s*(\d{1,3})\.\s+([A-Z][^\n]+)\n/m;

export type Section = {
  section: string;
  title: string;
  content: string;
};

export const splitIntoSections = (text: string): Section[] => {
  const matches = [...text.matchAll(SECTION_HEADER)];
  const sections: Section[] = [];

  for (let i = 0; i < matches.length; i++) {
    const current = matches[i];
    const next = matches[i + 1];
    const start = current.index!;
    const end = next ? next.index! : text.length;
    sections.push({
      section: current[1],
      title: current[2].trim(),
      content: text.slice(start, end).trim(),
    });
  }
  return sections;
};

export const chunkDocument = (
  document: FileContent,
  options: Partial<ChunkingOptions> = {},
): DocumentChunk[] => {
  const chunkSize = options.chunkSize ?? DEFAULT_CHUNK_SIZE;
  const overlapSize = Math.min(
    options.overlapSize ?? DEFAULT_OVERLAP_SIZE,
    Math.max(chunkSize - 1, 0),
  );

  if (chunkSize <= 0 || !document.text) {
    return [];
  }

  const { documentId, text } = document;
  const title = document.title ?? documentId;
  const sections = splitIntoSections(text);

  // No section headers — fall back to the plain character-based splitter so
  // documents without numbered headers behave exactly as before.
  if (sections.length === 0) {
    return splitTextByChars(text, chunkSize, overlapSize).map(
      (content, index) => ({
        id: `${documentId}-${index}`,
        title,
        content,
      }),
    );
  }

  const chunks: DocumentChunk[] = [];
  let index = 0;
  const push = (content: string, section?: string) => {
    chunks.push({
      id: `${documentId}-${index}`,
      title,
      content,
      ...(section ? { section } : {}),
    });
    index++;
  };

  // Preamble text before the first section header (title page, intro, etc).
  // It has no section number, so it carries no `section` stamp.
  const firstHeaderIndex = text.search(SECTION_HEADER_FIRST);
  if (firstHeaderIndex > 0) {
    for (const piece of splitTextByChars(
      text.slice(0, firstHeaderIndex),
      chunkSize,
      overlapSize,
    )) {
      push(piece);
    }
  }

  for (const section of sections) {
    // The first line of the section content is the header itself. Preserve it
    // verbatim (regex `\s+` may have matched extra spaces) rather than
    // reconstructing it from the captures.
    const [headerLine, ...bodyLines] = section.content.split("\n");
    const body = bodyLines.join("\n").trim();
    const sectionLabel = `Section ${section.section}`;

    // Short sections stay whole. Long sections are character-split *within*
    // the section body, so overlap/sliding-window logic never crosses a
    // section boundary; every sub-chunk keeps the header for context.
    if (body.length <= chunkSize) {
      push([headerLine, body].filter(Boolean).join("\n\n"), sectionLabel);
    } else {
      for (const piece of splitTextByChars(body, chunkSize, overlapSize)) {
        push(`${headerLine}\n\n${piece}`, sectionLabel);
      }
    }
  }

  return chunks;
};

// Iterative overlapping character split. Operates only on the text it is
// given — callers pass an already-bounded slice (a section body, the preamble,
// or the whole document) so the sliding window never crosses that boundary.
const splitTextByChars = (
  text: string,
  chunkSize: number,
  overlapSize: number,
): string[] => {
  const pieces: string[] = [];

  let start = 0;
  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    const splitAt = findWordBoundary(text, start, end);

    const content = text.slice(start, splitAt).trim();
    if (content) {
      pieces.push(content);
    }

    if (splitAt >= text.length) {
      break;
    }

    // Overlap the tail of the current chunk into the next chunk, but always
    // guarantee forward progress to avoid an infinite loop.
    start = splitAt - overlapSize > start ? splitAt - overlapSize : splitAt;
  }

  return pieces;
};

const findWordBoundary = (text: string, start: number, end: number): number => {
  const tolerance = Math.max(
    Math.floor((end - start) * WORD_BOUNDARY_TOLERANCE),
    1,
  );
  const lowerBound = end - tolerance;

  // Scan backward from the hard boundary for the nearest word break, so chunks
  // don't split mid-word.
  for (let i = end; i >= lowerBound; i--) {
    if (WORD_BOUNDARY.test(text[i] ?? "")) {
      // Include the whitespace itself so the next chunk starts at a clean word.
      return i + 1;
    }
  }

  // No word break within tolerance — hard split (e.g. a very long word).
  return end;
};
