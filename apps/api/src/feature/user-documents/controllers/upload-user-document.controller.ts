import { Request, Response } from "express";
import { HttpStatus } from "@/lib/http/http.status";
import { asyncHandler } from "@/lib/express/express.async-handler";
import { handleSSEStream } from "@/lib/express/express.sse";
import { HttpError } from "@/lib/http/http.error";
import { logger } from "@/lib/logger";
import { processUserDocument } from "../operations/user-documents.process";
import { UserDocumentConfig } from "../user-documents.config";

export const uploadUserDocumentController = asyncHandler(
  async (req: Request, res: Response) => {
    const sessionId = req.params.sessionId as string;
    const file = req.file;

    if (!file) {
      throw new HttpError(HttpStatus.BAD_REQUEST, "No file provided");
    }

    // Validate file type
    if (!UserDocumentConfig.ALLOWED_MIME_TYPES.includes(file.mimetype as any)) {
      throw new HttpError(
        HttpStatus.BAD_REQUEST,
        `Invalid file type. Allowed types: ${UserDocumentConfig.ALLOWED_MIME_TYPES.join(", ")}`,
      );
    }

    // Validate file size
    if (file.size > UserDocumentConfig.MAX_FILE_SIZE_BYTES) {
      throw new HttpError(
        HttpStatus.BAD_REQUEST,
        `File too large. Maximum size: ${UserDocumentConfig.MAX_FILE_SIZE_BYTES / 1024 / 1024}MB`,
      );
    }

    handleSSEStream(
      res,
      async (sse, closeStream) => {
        try {
          await processUserDocument(
            sessionId,
            file.buffer,
            file.originalname,
            (event) => {
              sse.sendEvent(event);
            },
          );
        } catch (error) {
          logger.error(
            { sessionId, filename: file.originalname, error },
            "Failed to process user document",
          );

          sse.sendError({
            message:
              error instanceof Error
                ? error.message
                : "Failed to process document",
            code: "DOCUMENT_PROCESSING_FAILED",
          });
        } finally {
          closeStream();
        }
      },
      {
        maxWaitMs: 300_000, // 5 minutes
        metadata: {
          name: "uploadUserDocumentController",
          requestId: req.requestId,
          route: req.path,
          resourceId: sessionId,
        },
        onTimeout: (sendError, close) => {
          sendError({
            message: "Document processing did not complete in time",
            code: "DOCUMENT_PROCESSING_TIMEOUT",
          });
          close();
        },
      },
    );
  },
);
