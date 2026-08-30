import { Request, Response } from "express";
import { findMatterDocument } from "../operations/matter.find";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/lib/http/http.status";
import { MatterDocumentSerializer } from "../matter.config";
import { asyncHandler } from "@/lib/express/express.async-handler";
import { unwrap } from "@/lib/drizzle/drizzle.utils";
import { HttpError } from "@/lib/http/http.error";

export const getMatterDocumentController = asyncHandler(
  async (req: Request, res: Response) => {
    const matterId = req.params.matterId as string;
    const documentId = req.params.documentId as string;

    const document = unwrap(
      await findMatterDocument("id", documentId),
      new HttpError(HttpStatus.NOT_FOUND, "Matter document not found"),
    );

    if (document.matterId !== matterId) {
      throw new HttpError(
        HttpStatus.NOT_FOUND,
        "Matter document not found for the specified matter",
      );
    }

    return sendSuccessResponse(
      req,
      res,
      {
        data: document,
        type: "single",
        serializerConfig: MatterDocumentSerializer,
      },
      {
        status: HttpStatus.SUCCESS,
      },
    );
  },
);
