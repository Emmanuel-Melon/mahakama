import { Request, Response } from "express";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/http-status";
import { SerializedLegalService } from "../services.config";
import { createService } from "../operations/services.create";
import { asyncHandler } from "@/lib/express/express.asyncHandler";
import { unwrap } from "@/lib/drizzle/drizzle.utils";
import { HttpError } from "@/lib/http/http.error";
import { serviceInsertSchema } from "../services.types";

export const addServiceController = asyncHandler(
  async (req: Request, res: Response) => {
    const validatedData = serviceInsertSchema.parse(req.body);

    const service = unwrap(
      await createService(validatedData),
      "An unexpected error occurred while creating the service",
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
        status: HttpStatus.CREATED,
      },
    );
  },
);
