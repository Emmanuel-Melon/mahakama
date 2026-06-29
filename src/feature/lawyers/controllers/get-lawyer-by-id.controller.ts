import { Request, Response } from "express";
import { findLawyerById } from "../operations/lawyers.find";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/http-status";
import { SerializedLawyer } from "../lawyers.config";
import { asyncHandler } from "@/lib/express/express.asyncHandler";
import { HttpError } from "@/lib/http/http.error";
import { unwrap } from "@/lib/drizzle/drizzle.utils";

export const getLawyerByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const lawyerId = req.params.id;
    const lawyer = unwrap(
      await findLawyerById(lawyerId),
      new HttpError(HttpStatus.NOT_FOUND, "Failed to find lawyer"),
    );
    return sendSuccessResponse(
      req,
      res,
      {
        data: { ...lawyer, id: lawyer.id.toString() } as typeof lawyer & {
          id: string;
        },
        type: "single",
        serializerConfig: SerializedLawyer,
      },
      {
        status: HttpStatus.SUCCESS,
      },
    );
  },
);
