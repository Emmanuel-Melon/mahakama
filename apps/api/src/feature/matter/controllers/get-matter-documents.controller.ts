import { Request, Response } from "express";
import {
  findMatter,
  findMatterDocumentsByMatter,
} from "../operations/matter.find";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/lib/http/http.status";
import { MatterDocumentSerializer } from "../matter.config";
import { asyncHandler } from "@/lib/express/express.async-handler";
import { unwrap } from "@/lib/drizzle/drizzle.utils";
import { HttpError } from "@/lib/http/http.error";

export const getMatterDocumentsController = asyncHandler(
  async (req: Request, res: Response) => {
    const matterId = req.params.matterId as string;

    unwrap(
      await findMatter("id", matterId),
      new HttpError(HttpStatus.NOT_FOUND, "Matter not found"),
    );

    const result = await findMatterDocumentsByMatter(matterId);

    const documents = result.data.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    return sendSuccessResponse(
      req,
      res,
      {
        data: documents,
        type: "collection",
        serializerConfig: MatterDocumentSerializer,
      },
      {
        status: HttpStatus.SUCCESS,
        additionalMeta: {
          total: documents.length,
        },
      },
    );
  },
);