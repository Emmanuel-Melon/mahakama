import { Request, Response } from "express";
import { findCorpusEntries } from "../operations/corpus.find";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/lib/http/http.status";
import { CorpusSerializer } from "../corpus.config";
import { asyncHandler } from "@/lib/express/express.async-handler";
import { parsePagination } from "@/lib/express/express.query";

export const getCorpusController = asyncHandler(
  async (req: Request, res: Response) => {
    const pagination = parsePagination(req);
    const entries = await findCorpusEntries(pagination);
    sendSuccessResponse(
      req,
      res,
      {
        data: entries.data,
        type: "collection",
        serializerConfig: CorpusSerializer,
      },
      {
        status: HttpStatus.SUCCESS,
        additionalMeta: {
          total: entries.count,
        },
      },
    );
  },
);
