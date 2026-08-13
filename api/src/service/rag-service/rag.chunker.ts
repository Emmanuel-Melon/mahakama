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
  const chunks: DocumentChunk[] = [];

  let start = 0;
  let index = 0;

  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    const splitAt = findWordBoundary(text, start, end);

    const content = text.slice(start, splitAt).trim();
    if (content) {
      chunks.push({
        id: `${documentId}-${index}`,
        title,
        content,
      });
      index++;
    }

    if (splitAt >= text.length) {
      break;
    }

    // Overlap the tail of the current chunk into the next chunk, but always
    // guarantee forward progress to avoid an infinite loop.
    start = splitAt - overlapSize > start ? splitAt - overlapSize : splitAt;
  }

  return chunks;
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
