import { Request, Response } from "express";
import { createDocument } from "../operations/documents.create";
import { NewDocument } from "../documents.types";
import { HttpStatus } from "@/http-status";
import { documentsQueue } from "../jobs/documents.queue";
import { DocumentsSerializer } from "../document.config";
import { asyncHandler } from "@/lib/express/express.asyncHandler";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { unwrap } from "@/lib/drizzle/drizzle.utils";
import { HttpError } from "@/lib/http/http.error";
import { DocumentJobs } from "../document.config";
import { serverConfig } from "@/config";
import { getStoragePath } from "@/lib/storage/storage";
import { statSync } from "fs";
import { logger } from "@/lib/logger";

export const createDocumentHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const documentData: NewDocument = req.validatedBody;
    let storageUrl = documentData.storageUrl;
    if (!/^https?:\/\//i.test(storageUrl)) {
      storageUrl = storageUrl.startsWith("/")
        ? `${serverConfig.baseUrl}${storageUrl}`
        : `https://${storageUrl}`;
    }
    const document = unwrap(
      await createDocument({
        ...documentData,
        storageUrl,
      }),
      new HttpError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "Failed to create document",
      ),
    );

    sendSuccessResponse(
      req,
      res,
      {
        data: { ...document, id: document.id.toString() } as typeof document & {
          id: string;
        },
        type: "single",
        serializerConfig: DocumentsSerializer,
      },
      {
        status: HttpStatus.CREATED,
      },
    );

    // Enqueue processing for both locally-resolvable paths and external
    // http(s) URLs (the worker fetches remote PDFs via `parsePdfFromUrl`).
    // For local files, pass the real size on disk instead of 0.
    let enqueued = false;
    try {
      let size = 0;
      const isExternalUrl =
        /^https?:\/\//i.test(storageUrl) &&
        !storageUrl.startsWith(serverConfig.baseUrl);
      if (!isExternalUrl) {
        const localPath = getStoragePath(storageUrl);
        try {
          size = statSync(localPath).size;
        } catch {
          // File missing on disk — still enqueue; the worker will fail loudly.
        }
      }
      await documentsQueue.add(DocumentJobs.DocumentUploaded, {
        documentId: document.id,
        userId: req.user?.id!,
        filename: document.title,
        size,
      });
      enqueued = true;
    } catch (error) {
      logger.error(
        { documentId: document.id, error },
        "Failed to enqueue document upload job",
      );
    }
    logger.info(
      { documentId: document.id, enqueued, storageUrl },
      "Document created",
    );
  },
);
