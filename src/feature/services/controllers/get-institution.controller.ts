import { Request, Response } from "express";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/http-status";
import { findInstitutionById } from "../operations/services.find";
import { asyncHandler } from "@/lib/express/express.asyncHandler";
import { unwrap } from "@/lib/drizzle/drizzle.utils";
import { HttpError } from "@/lib/http/http.error";
import { SerializedInstitution } from "../services.config";

export const getInstitutionByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const institutionId = req.params.institutionId as string;

    const institution = unwrap(
      await findInstitutionById(institutionId),
      new HttpError(HttpStatus.NOT_FOUND, "Institution not found"),
    );

    sendSuccessResponse(
      req,
      res,
      {
        data: institution,
        type: "single",
        serializerConfig: SerializedInstitution,
      },
      {
        status: HttpStatus.SUCCESS,
      },
    );
  },
);
