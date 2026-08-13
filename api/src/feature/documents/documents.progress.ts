import { EventEmitter } from "events";
import type { DocumentIngestionEvent } from "./documents.types";

// In-process relay for ingestion progress. Works because the worker and the
// HTTP server run in the same process (see `src/server.ts` → `initAllWorkers`).
const emitter = new EventEmitter();
// Many concurrent uploads may subscribe simultaneously — never warn.
emitter.setMaxListeners(0);

export const publishIngestionEvent = (
  documentId: string,
  event: DocumentIngestionEvent,
) => {
  emitter.emit(documentId, event);
};

export const subscribeIngestion = (
  documentId: string,
  listener: (event: DocumentIngestionEvent) => void,
): (() => void) => {
  emitter.on(documentId, listener as (...args: unknown[]) => void);
  return () => {
    emitter.off(documentId, listener as (...args: unknown[]) => void);
  };
};
