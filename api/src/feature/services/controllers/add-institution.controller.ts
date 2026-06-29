import { Request, Response } from "express";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/http-status";
import { SerializedInstitution } from "../services.config";
import { createInstitution } from "../operations/services.create";
import { asyncHandler } from "@/lib/express/express.asyncHandler";
import { unwrap } from "@/lib/drizzle/drizzle.utils";
import { HttpError } from "@/lib/http/http.error";
import { institutionInsertSchema } from "../services.types";

export const addInstitutionController = asyncHandler(
  async (req: Request, res: Response) => {
    const validatedData = institutionInsertSchema.parse(req.body);

    const institution = unwrap(
      await createInstitution(validatedData),
      new HttpError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "Failed to create institution",
      ),
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
        status: HttpStatus.CREATED,
      },
    );
  },
);
