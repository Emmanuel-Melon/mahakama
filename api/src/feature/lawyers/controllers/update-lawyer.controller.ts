import { Request, Response } from "express";
import { updateLawyer } from "../operations/lawyers.update";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/http-status";
import { SerializedLawyer } from "../lawyers.config";
import { asyncHandler } from "@/lib/express/express.asyncHandler";
import { unwrap } from "@/lib/drizzle/drizzle.utils";
import { HttpError } from "@/lib/http/http.error";

export const updateLawyerController = asyncHandler(
  async (req: Request, res: Response) => {
    const lawyerId = req.params.id as string;
    const updateData = req.body;

    const lawyer = unwrap(
      await updateLawyer(Number(lawyerId), updateData),
      new HttpError(HttpStatus.NOT_FOUND, "Lawyer not found"),
    );

    return sendSuccessResponse(
      req,
      res,
      {
        data: { ...lawyer, id: lawyer?.id.toString() } as typeof lawyer & {
          id: string;
        },
        type: "single",
        serializerConfig: SerializedLawyer,
      },
      {
        status: HttpStatus.ACCEPTED,
      },
    );
  },
);
