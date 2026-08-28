import { Request, Response } from "express";
import { findConsultation } from "../operations/consultations.find";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/lib/http/http.status";
import { SerializedConsultation } from "../consultations.config";
import { unwrap } from "@/lib/drizzle/drizzle.utils";
import { HttpError } from "@/lib/http/http.error";
import { asyncHandler } from "@/lib/express/express.async-handler";

export const getConsultationController = asyncHandler(
  async (req: Request, res: Response) => {
    const consultationId = req.params.id as string;
    const consultation = unwrap(
      await findConsultation("id", consultationId),
      new HttpError(HttpStatus.NOT_FOUND, "Consultation not found"),
    );

    sendSuccessResponse(
      req,
      res,
      {
        data: { ...consultation },
        serializerConfig: SerializedConsultation,
        type: "single",
      },
      { status: HttpStatus.SUCCESS },
    );
  },
);
