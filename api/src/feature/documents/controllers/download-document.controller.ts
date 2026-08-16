import { Request, Response } from "express";
import { downloadDocument } from "../operations/documents.download";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { findDocument } from "../operations/documents.find";
import { HttpStatus } from "@/lib/http/http.status";
import { DocumentsSerializer } from "../document.config";
import { asyncHandler } from "@/lib/express/express.async-handler";
import { unwrap } from "@/lib/drizzle/drizzle.utils";
import { HttpError } from "@/lib/http/http.error";

export const downloadDocumentController = asyncHandler(
  async (req: Request, res: Response) => {
    const documentId = req.params.documentId as string;
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
      await findDocument("id", documentId),
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
