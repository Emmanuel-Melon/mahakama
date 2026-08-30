import { Request, Response } from "express";
import { findMatter } from "../operations/matter.find";
import {
  insertMatterDocument,
  recordMatterActivity,
} from "../operations/matter.insert";
import type { NewMatterDocument } from "../matter.types";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/lib/http/http.status";
import { MatterDocumentSerializer, MattersJobs } from "../matter.config";
import { unwrap } from "@/lib/drizzle/drizzle.utils";
import { HttpError } from "@/lib/http/http.error";
import { asyncHandler } from "@/lib/express/express.async-handler";
import { saveUploadedFile } from "@/lib/storage/storage";
import { matterQueue } from "../jobs/matter.queue";
import { logger } from "@/lib/logger";

export const uploadMatterDocumentController = asyncHandler(
  async (req: Request, res: Response) => {
    const matterId = req.params.matterId as string;
    const file = req.file;
    const description = (req.body?.description as string | undefined) ?? null;
    const uploadedByUserId = req.user?.id;

    unwrap(
      await findMatter("id", matterId),
      new HttpError(HttpStatus.NOT_FOUND, "Matter not found"),
    );

    if (!file) {
      throw new HttpError(HttpStatus.BAD_REQUEST, "No file provided");
    }

    if (!uploadedByUserId) {
      throw new HttpError(
        HttpStatus.BAD_REQUEST,
        "Uploading user ID is required",
      );
    }

    const uploadResult = saveUploadedFile({
      buffer: file.buffer,
      fileName: file.originalname,
      mimeType: file.mimetype,
    });

    const document = unwrap(
      await insertMatterDocument({
        matterId,
        uploadedByUserId,
        fileName: file.originalname,
        fileUrl: uploadResult.publicUrl,
        fileType: file.mimetype,
        fileSize: file.size,
        description,
      } as NewMatterDocument),
      new HttpError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "Failed to create matter document",
      ),
    );

    try {
      await matterQueue.add(MattersJobs.ProcessMatterDocument, {
        matterId,
        documentId: document.id,
      });
    } catch (error) {
      logger.error(
        { matterId, documentId: document.id, error },
        "Failed to enqueue matter document processing job",
      );
    }

    await recordMatterActivity({
      matterId,
      actorUserId: uploadedByUserId,
      type: "document_uploaded",
      title: "Document uploaded",
      description: file.originalname,
      metadata: { documentId: document.id },
    });

    return sendSuccessResponse(
      req,
      res,
      {
        data: {
          ...document,
        },
        serializerConfig: MatterDocumentSerializer,
        type: "single",
      },
      {
        status: HttpStatus.CREATED,
      },
    );
  },
);
