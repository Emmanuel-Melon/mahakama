import { Request, Response } from "express";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/http-status";
import { SerializedInstitution } from "../services.config";
import { findAllInstitutions } from "../operations/services.find";
import { asyncHandler } from "@/lib/express/express.asyncHandler";

export const getInstitutionsController = asyncHandler(
  async (req: Request, res: Response) => {
    const institutions = await findAllInstitutions();

    sendSuccessResponse(
      req,
      res,
      {
        data: institutions.data,
        type: "collection",
        serializerConfig: SerializedInstitution,
      },
      {
        status: HttpStatus.SUCCESS,
      },
    );
  },
);
