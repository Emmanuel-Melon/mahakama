import { Request, Response } from "express";
import { HttpStatus } from "@/lib/http/http.status";
import { asyncHandler } from "@/lib/express/express.async-handler";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { deleteUserDocument } from "../operations/user-documents.process";
import { logger } from "@/lib/logger";
import { SerializedUserDocumentDeletion } from "../user-documents.config";

export const deleteUserDocumentController = asyncHandler(
  async (req: Request, res: Response) => {
    const sessionId = req.params.sessionId as string;

    const deleted = await deleteUserDocument(sessionId);

    logger.info({ sessionId, deleted }, "User document deletion attempted");

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
        serializerConfig: SerializedUserDocumentDeletion,
        type: "single",
      },
      {
        status: HttpStatus.SUCCESS,
      },
    );
  },
);
