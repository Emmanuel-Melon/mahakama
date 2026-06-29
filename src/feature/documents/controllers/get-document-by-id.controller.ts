import { Request, Response } from "express";
import { findDocumentById } from "../operations/document.find";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/http-status";
import { DocumentsSerializer } from "../document.config";
import { asyncHandler } from "@/lib/express/express.asyncHandler";
import { unwrap } from "@/lib/drizzle/drizzle.utils";
import { HttpError } from "@/lib/http/http.error";

export const getDocumentByIdControlle = asyncHandler(
  async (req: Request, res: Response) => {
    const { documentId } = req.params;
    const document = unwrap(
      await findDocumentById(documentId),
      new HttpError(HttpStatus.NOT_FOUND, "Document not found"),
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
        status: HttpStatus.SUCCESS,
      },
    );
  },
);
