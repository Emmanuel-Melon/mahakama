import { Request, Response } from "express";
import { findMatterDocument } from "../operations/matter.find";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/lib/http/http.status";
import { MatterDocumentSerializer, MattersJobs } from "../matter.config";
import { asyncHandler } from "@/lib/express/express.async-handler";
import { unwrap } from "@/lib/drizzle/drizzle.utils";
import { HttpError } from "@/lib/http/http.error";
import { matterQueue } from "../jobs/matter.queue";
import { logger } from "@/lib/logger";

export const analyzeMatterDocumentController = asyncHandler(
  async (req: Request, res: Response) => {
    const matterId = req.params.matterId as string;
    const documentId = req.params.documentId as string;

    const document = unwrap(
      await findMatterDocument("id", documentId),
      new HttpError(HttpStatus.NOT_FOUND, "Matter document not found"),
    );

    if (document.matterId !== matterId) {
      throw new HttpError(
        HttpStatus.NOT_FOUND,
        "Matter document not found for the specified matter",
      );
    }

    try {
      await matterQueue.add(MattersJobs.ProcessMatterDocumentAnalysis, {
        matterId,
        documentId,
      });
    } catch (error) {
      logger.error(
        { matterId, documentId, error },
        "Failed to enqueue matter document analysis job",
      );
      throw new HttpError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "Failed to enqueue document analysis",
      );
    }

    return sendSuccessResponse(
      req,
      res,
      {
        data: document,
        type: "single",
        serializerConfig: MatterDocumentSerializer,
      },
      {
        status: HttpStatus.ACCEPTED,
      },
    );
  },
);
