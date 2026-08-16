import {
  DocumentIngestionEvent,
  documentIngestionEventSchema,
} from "./documents.types";

export function isDocumentIngestionEvent(
  event: unknown,
): event is DocumentIngestionEvent {
  try {
    documentIngestionEventSchema.parse(event);
    return true;
  } catch {
    return false;
  }
}

export const extractPdfMetadata = (file: Express.Multer.File) => {};
