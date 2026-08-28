import { Request, Response } from "express";
import { createLawyer } from "../operations/lawyers.create";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/lib/http/http.status";
import { SerializedLawyer } from "../lawyers.config";
import { asyncHandler } from "@/lib/express/express.async-handler";
import { HttpError } from "@/lib/http/http.error";
import { unwrap } from "@/lib/drizzle/drizzle.utils";

export const createLawyerController = asyncHandler(
  async (req: Request, res: Response) => {
    const lawyerAttrs = req.body;

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
