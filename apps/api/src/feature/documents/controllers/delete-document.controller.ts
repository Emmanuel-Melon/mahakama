import { Request, Response } from "express";
import { HttpStatus } from "@/lib/http/http.status";
import { asyncHandler } from "@/lib/express/express.async-handler";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { deleteDocument } from "../operations/documents.process";
import { logger } from "@/lib/logger";
import { SerializedDocumentDeletion } from "../documents.config";

export const deleteDocumentController = asyncHandler(
  async (req: Request, res: Response) => {
    const sessionId = req.params.sessionId as string;

    const deleted = await deleteDocument(sessionId);

    logger.info({ sessionId, deleted }, "Document deletion attempted");

    const deletionResult = {
      sessionId,
      deleted,
      message: deleted
        ? "Document deleted successfully"
        : "No document found for this session",
    };

    return sendSuccessResponse(
      req,
      res,
      {
        data: deletionResult,
        serializerConfig: SerializedDocumentDeletion,
        type: "single",
      },
      {
        status: HttpStatus.SUCCESS,
      },
    );
  },
);
