import { Request, Response } from "express";
import { HttpStatus } from "@/lib/http/http.status";
import { asyncHandler } from "@/lib/express/express.async-handler";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { getDocumentStatus } from "../operations/documents.process";
import { SerializedDocumentStatus } from "../documents.config";

export const getDocumentStatusController = asyncHandler(
  async (req: Request, res: Response) => {
    const sessionId = req.params.sessionId as string;
    const status = await getDocumentStatus(sessionId);

    return sendSuccessResponse(
      req,
      res,
      {
        data: status,
        serializerConfig: SerializedDocumentStatus,
        type: "single",
      },
      {
        status: HttpStatus.SUCCESS,
      },
    );
  },
);
