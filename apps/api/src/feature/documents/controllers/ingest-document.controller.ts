import { Request, Response } from "express";
import { createDocument } from "../operations/documents.create";
import { HttpStatus } from "@/lib/http/http.status";
import { saveUploadedFile } from "@/lib/storage/storage";
import { asyncHandler } from "@/lib/express/express.async-handler";
import { documentsQueue } from "../jobs/documents.queue";
import { handleSSEStream } from "@/lib/express/express.sse";
import { unwrap } from "@/lib/drizzle/drizzle.utils";
import { HttpError } from "@/lib/http/http.error";
import { DocumentJobs } from "../document.config";
import { logger } from "@/lib/logger";
import { subscribeIngestion } from "../documents.progress";

export const ingestDocumentController = asyncHandler(
  async (req: Request, res: Response) => {
    const file = req.file;
    const { title, description, type, sections } = req.body;
    const { actName, jurisdiction, sourceUrl } = req.body as Record<
      string,
      string | undefined
    >;

    if (!file) {
      throw new HttpError(HttpStatus.BAD_REQUEST, "No file provided");
    }

    const uploadResult = saveUploadedFile({
      buffer: file.buffer,
      fileName: file.originalname,
      mimeType: file.mimetype,
    });

    const document = unwrap(
      await createDocument({
        title: title || file.originalname,
        description: description || "No description",
        type: type || "contract",
        sections: Number(sections) || 1,
        lastUpdated: new Date().toISOString().slice(0, 10),
        storageUrl: uploadResult.publicUrl,
        actName,
        jurisdiction,
        sourceUrl,
      }),
      new HttpError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "Failed to create document",
      ),
    );

    handleSSEStream(
      res,
      async (sse, closeStream) => {
        // Subscribe before enqueue to ensure no early completion events are missed
        const unsubscribe = subscribeIngestion(document.id, (event) => {
          if (event.type === "completed" || event.type === "error") {
            unsubscribe();
            sse.sendEvent(event);
            closeStream();
            return;
          }
          sse.sendEvent(event);
        });

        // Ensure we unsubscribe if the stream ends prematurely
        res.on("close", () => unsubscribe());

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
          unsubscribe();
          sse.sendError({
            message: "Failed to enqueue ingestion job",
            code: "INGESTION_ENQUEUE_FAILED",
          });
          closeStream();
        }
      },
      {
        maxWaitMs: 600_000, // 10 minutes
        metadata: {
          name: "ingestDocumentController",
          requestId: req.requestId,
          route: req.path,
          resourceId: document.id.toString(),
        },
        onTimeout: (sendError, close) => {
          sendError({
            message: "Ingestion job did not complete in time",
            code: "INGESTION_TIMEOUT",
          });
          close();
        },
      },
    );
  },
);
