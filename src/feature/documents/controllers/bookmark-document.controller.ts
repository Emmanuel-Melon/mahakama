import { Request, Response } from "express";
import { bookmarkDocument } from "../operations/documents.update";
import { HttpStatus } from "@/http-status";
import { DocumentsSerializer } from "../document.config";
import { asyncHandler } from "@/lib/express/express.asyncHandler";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { unwrap } from "@/lib/drizzle/drizzle.utils";
import { HttpError } from "@/lib/http/http.error";

export const bookmarkDocumentController = asyncHandler(
  async (req: Request, res: Response) => {
    const { documentId } = req.validatedParams;
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
