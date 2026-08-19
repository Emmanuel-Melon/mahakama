import {
  CorpusIngestionEvent,
  corpusIngestionEventSchema,
} from "./corpus.types";

export function isCorpusIngestionEvent(
  event: unknown,
): event is CorpusIngestionEvent {
  try {
    corpusIngestionEventSchema.parse(event);
    return true;
  } catch {
    return false;
  }
}

export const extractPdfMetadata = (file: Express.Multer.File) => {};
