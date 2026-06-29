import { Request, Response } from "express";
import { db } from "@/lib/drizzle";
import { createLawyer } from "../operations/lawyers.create";
import { lawyersTable } from "../lawyers.schema";
import { eq } from "drizzle-orm";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/http-status";
import { SerializedLawyer } from "../lawyers.config";
import { asyncHandler } from "@/lib/express/express.asyncHandler";
import { HttpError } from "@/lib/http/http.error";
import { unwrap } from "@/lib/drizzle/drizzle.utils";
import { findLawyerByEmail } from "../operations/lawyers.find";

export const createLawyerController = asyncHandler(
  async (req: Request, res: Response) => {
    const lawyerAttrs = req.body;
    const existingLawyer = unwrap(
      await findLawyerByEmail(lawyerAttrs.email),
      new HttpError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "Failed to check if lawyer exists",
      ),
    );

    const lawyer = unwrap(
      await createLawyer(lawyerAttrs),
      new HttpError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "Failed to create lawyer",
      ),
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
        status: HttpStatus.CREATED,
      },
    );
  },
);
