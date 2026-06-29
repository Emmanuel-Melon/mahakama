import { Request, Response } from "express";
import { downloadDocument } from "../operations/documents.update";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { findDocumentById } from "../operations/document.find";
import { HttpStatus } from "@/http-status";
import { DocumentsSerializer } from "../document.config";
import { parsePdfFromUrl } from "@/lib/pdf-parse/index";
import { asyncHandler } from "@/lib/express/express.asyncHandler";
import { unwrap } from "@/lib/drizzle/drizzle.utils";
import { HttpError } from "@/lib/http/http.error";

export const downloadDocumentController = asyncHandler(
  async (req: Request, res: Response) => {
    const { documentId } = req.validatedParams;
    const userId = req.user?.id;

    unwrap(
      await downloadDocument({
        documentId,
        user_id: userId!,
      }),
      new HttpError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "Failed to download document",
      ),
    );

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

    parsePdfFromUrl(document.storageUrl);
  },
);
