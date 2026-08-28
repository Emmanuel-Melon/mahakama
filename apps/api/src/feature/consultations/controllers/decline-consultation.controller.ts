import { Request, Response } from "express";
import { declineConsultation } from "../operations/consultations.update";
import type { DeclineConsultation } from "../consultations.types";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/lib/http/http.status";
import { SerializedConsultation } from "../consultations.config";
import { unwrap } from "@/lib/drizzle/drizzle.utils";
import { HttpError } from "@/lib/http/http.error";
import { asyncHandler } from "@/lib/express/express.async-handler";

export const declineConsultationController = asyncHandler(
  async (req: Request, res: Response) => {
    const { declineReason } = req.body as DeclineConsultation;
    const consultationId = req.params.id as string;
    const consultation = unwrap(
      await declineConsultation(consultationId, declineReason),
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
