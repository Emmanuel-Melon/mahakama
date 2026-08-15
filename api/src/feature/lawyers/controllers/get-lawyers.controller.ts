import { Request, Response } from "express";
import { findLawyers } from "../operations/lawyers.find";
import { HttpStatus } from "@/lib/http/http.status";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { asyncHandler } from "@/lib/express/express.async-handler";
import { parsePagination } from "@/lib/express/express.query";
import { SerializedLawyer } from "../lawyers.config";

export const getLawyersController = asyncHandler(
  async (req: Request, res: Response) => {
    const pagination = parsePagination(req);
    const result = await findLawyers(pagination);
    sendSuccessResponse(
      req,
      res,
      {
        data: result.data,
        type: "collection",
        serializerConfig: SerializedLawyer,
      },
      {
        status: HttpStatus.SUCCESS,
      },
    );
  },
);
