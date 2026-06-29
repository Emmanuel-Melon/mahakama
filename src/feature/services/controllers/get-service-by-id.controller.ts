import { Request, Response } from "express";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/http-status";
import { SerializedLegalService } from "../services.config";
import { findServiceBySlug } from "../operations/services.find";
import { asyncHandler } from "@/lib/express/express.asyncHandler";
import { unwrap } from "@/lib/drizzle/drizzle.utils";
import { HttpError } from "@/lib/http/http.error";

export const getLegalServiceByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const serviceId = req.params.serviceId as string;

    const service = unwrap(
      await findServiceBySlug(serviceId),
      new HttpError(HttpStatus.NOT_FOUND, "Service not found"),
    );

    sendSuccessResponse(
      req,
      res,
      {
        data: service,
        type: "single",
        serializerConfig: SerializedLegalService,
      },
      {
        status: HttpStatus.SUCCESS,
      },
    );
  },
);
