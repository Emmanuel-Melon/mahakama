import { Request, Response } from "express";
import { findConsultations } from "../operations/consultations.find";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/lib/http/http.status";
import { SerializedConsultation } from "../consultations.config";
import { asyncHandler } from "@/lib/express/express.async-handler";
import { parsePagination } from "@/lib/express/express.query";

export const getConsultationsController = asyncHandler(
  async (req: Request, res: Response) => {
    const pagination = parsePagination(req);
    const result = await findConsultations(pagination);
    return sendSuccessResponse(
      req,
      res,
      {
        data: result.data,
        serializerConfig: SerializedConsultation,
        type: "collection",
      },
      {
        status: HttpStatus.SUCCESS,
        additionalMeta: { total: result.count },
      },
    );
  },
);
