import { Request, Response } from "express";
import { createDocument } from "../operations/documents.create";
import { HttpStatus } from "@/http-status";
import { saveUploadedFile } from "@/lib/storage/storage";
import { asyncHandler } from "@/lib/express/express.asyncHandler";
import { documentsQueue } from "../jobs/documents.queue";
import { initSSE } from "@/lib/express/express.response";
import { unwrap } from "@/lib/drizzle/drizzle.utils";
import { HttpError } from "@/lib/http/http.error";
import { DocumentJobs } from "../document.config";
import { logger } from "@/lib/logger";
import { subscribeIngestion } from "../documents.progress";

const KEEP_ALIVE_INTERVAL_MS = 15_000;
const MAX_WAIT_MS = 60_000;

export const ingestDocumentController = asyncHandler(
  async (req: Request, res: Response) => {
    const file = req.file;
    const { title, description, type, sections } = req.body;

    if (!file) {
      throw new Error("No file provided");
    }

    const uploadResult = saveUploadedFile({
      buffer: file.buffer,
      fileName: file.originalname,
      mimeType: file.mimetype,
    });

    // Create document record
    const document = unwrap(
      await createDocument({
        title: title || file.originalname,
        description: description || "No description",
        type: type || "contract",
        sections: Number(sections) || 1,
        lastUpdated: new Date().getFullYear().toString(),
        storageUrl: uploadResult.publicUrl,
      }),
      new HttpError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "Failed to create document",
      ),
    );

    const sse = initSSE(res, {
      metadata: {
        name: "ingestDocumentController",
        requestId: req.requestId,
        route: req.path,
        resourceId: document.id.toString(),
      },
    });

    let keepAliveTimer: ReturnType<typeof setInterval> | undefined;
    let timeoutTimer: ReturnType<typeof setTimeout> | undefined;
    let terminated = false;

    const stopTimers = () => {
      if (keepAliveTimer) clearInterval(keepAliveTimer);
      if (timeoutTimer) clearTimeout(timeoutTimer);
    };

    const endStream = () => {
      if (!res.writableEnded) res.end();
    };

    // Subscribe before enqueue so a fast job can't be missed.
    const unsubscribe = subscribeIngestion(document.id, (event) => {
      if (terminated || res.writableEnded) return;

      if (event.type === "completed" || event.type === "error") {
        terminated = true;
        stopTimers();
        unsubscribe();
        sse.sendEvent(event);
        endStream();
        return;
      }

      sse.sendEvent(event);
    });

    res.on("close", () => {
      terminated = true;
      stopTimers();
      unsubscribe();
    });

    keepAliveTimer = setInterval(() => {
      if (!res.writableEnded) res.write(": ping\n\n");
    }, KEEP_ALIVE_INTERVAL_MS);
    keepAliveTimer.unref?.();

    timeoutTimer = setTimeout(() => {
      if (terminated || res.writableEnded) return;
      terminated = true;
      stopTimers();
      unsubscribe();
      sse.sendEvent({
        type: "error",
        data: {
          message: "Ingestion job did not complete in time",
          code: "INGESTION_TIMEOUT",
        },
      });
      endStream();
    }, MAX_WAIT_MS);
    timeoutTimer.unref?.();

    sse.sendEvent({
      type: "started",
      data: {
        timestamp: new Date().toISOString(),
        filename: file.originalname,
        size: file.size,
      },
    });

    try {
      await documentsQueue.add(DocumentJobs.DocumentUploaded, {
        documentId: document.id,
        userId: req.user?.id!,
        filename: file.originalname,
        size: file.size,
      });
    } catch (error) {
      logger.error(
        { documentId: document.id, error },
        "Failed to enqueue document upload job",
      );
      if (terminated || res.writableEnded) return;
      terminated = true;
      stopTimers();
      unsubscribe();
      sse.sendEvent({
        type: "error",
        data: {
          message: "Failed to enqueue ingestion job",
          code: "INGESTION_ENQUEUE_FAILED",
        },
      });
      endStream();
    }
  },
);
