import { Request, Response } from "express";
import { deleteLawyerProfileDocument } from "../operations/lawyer-profile-documents.delete";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/lib/http/http.status";
import { asyncHandler } from "@/lib/express/express.async-handler";
import { HttpError } from "@/lib/http/http.error";
import { unwrap } from "@/lib/drizzle/drizzle.utils";

export const deleteDocumentController = asyncHandler(
  async (req: Request, res: Response) => {
    const documentId = req.params.documentId as string;

    unwrap(
      await deleteLawyerProfileDocument(documentId),
      new HttpError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "Failed to delete document",
      ),
    );

    return sendSuccessResponse(req, res, undefined, {
      status: HttpStatus.NO_CONTENT,
    });
  },
);
