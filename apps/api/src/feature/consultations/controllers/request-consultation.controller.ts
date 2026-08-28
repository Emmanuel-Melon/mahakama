import { Request, Response } from "express";
import { createConsultation } from "../operations/consultations.insert";
import type { CreateConsultation } from "../consultations.types";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/lib/http/http.status";
import { SerializedConsultation } from "../consultations.config";
import { unwrap } from "@/lib/drizzle/drizzle.utils";
import { HttpError } from "@/lib/http/http.error";
import { asyncHandler } from "@/lib/express/express.async-handler";

export const requestConsultationController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = req.body as CreateConsultation;
    const customerId = req.user?.id || "";

    const consultation = unwrap(
      await createConsultation({
        ...body,
        customerId,
      }),
      new HttpError(HttpStatus.BAD_REQUEST, "Failed to request consultation"),
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
