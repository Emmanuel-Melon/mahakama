import { Request, Response } from "express";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/http-status";
import { SerializedLegalService } from "../services.config";
import { findServices } from "../operations/services.find";
import { asyncHandler } from "@/lib/express/express.asyncHandler";
import { parsePagination } from "@/lib/express/express.query";

export const getLegalServicesController = asyncHandler(
  async (req: Request, res: Response) => {
    const pagination = parsePagination(req);
    const services = await findServices(pagination);
    sendSuccessResponse(
      req,
      res,
      {
        data: services.data,
        type: "collection",
        serializerConfig: SerializedLegalService,
      },
      {
        status: HttpStatus.SUCCESS,
      },
    );
  },
);
