import { Request, Response } from "express";
import { HttpStatus } from "@/lib/http/http.status";
import { asyncHandler } from "@/lib/express/express.async-handler";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { getUserDocumentStatus } from "../operations/user-documents.process";
import { SerializedUserDocumentStatus } from "../user-documents.config";

export const getUserDocumentStatusController = asyncHandler(
  async (req: Request, res: Response) => {
    const sessionId = req.params.sessionId as string;
    const status = await getUserDocumentStatus(sessionId);

    return sendSuccessResponse(
      req,
      res,
      {
        data: status,
        serializerConfig: SerializedUserDocumentStatus,
        type: "single",
      },
      {
        status: HttpStatus.SUCCESS,
      },
    );
  },
);
