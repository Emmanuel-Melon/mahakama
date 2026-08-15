import { Request, Response } from "express";
import { bookmarkDocument } from "../operations/documents.update";
import { HttpStatus } from "@/lib/http/http.status";
import { DocumentsSerializer } from "../document.config";
import { asyncHandler } from "@/lib/express/express.async-handler";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { unwrap } from "@/lib/drizzle/drizzle.utils";
import { HttpError } from "@/lib/http/http.error";

export const bookmarkDocumentController = asyncHandler(
  async (req: Request, res: Response) => {
    const documentId = req.params.documentId as string;
    const userId = req.user?.id;

    const document = unwrap(
      await bookmarkDocument({
        documentId,
        user_id: userId!,
      }),
      new HttpError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "Failed to bookmark document",
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
  },
);
