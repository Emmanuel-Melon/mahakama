import { Request, Response } from "express";
import { findDocuments } from "../operations/document.find";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/http-status";
import { DocumentsSerializer } from "../document.config";
import { asyncHandler } from "@/lib/express/express.asyncHandler";
import { parsePagination } from "@/lib/express/express.query";

export const getDocumentsController = asyncHandler(
  async (req: Request, res: Response) => {
    const pagination = parsePagination(req);
    const documents = await findDocuments(pagination);
    sendSuccessResponse(
      req,
      res,
      {
        data: documents.data,
        type: "collection",
        serializerConfig: DocumentsSerializer,
      },
      {
        status: HttpStatus.SUCCESS,
        additionalMeta: {
          total: documents.count,
        },
      },
    );
  },
);
