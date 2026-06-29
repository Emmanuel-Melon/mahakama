import { Request, Response } from "express";
import { asyncHandler } from "@/lib/express/express.asyncHandler";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/lib/http/http.status";
import { HttpError } from "@/lib/http/http.error";
import { unwrap } from "@/lib/drizzle/drizzle.utils";
import { findPreference } from "../operations/inference.find";

export const getPreferenceController = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId, strategyKey } = req.params;
    const preference = unwrap(
      await findPreference(userId, strategyKey),
      new HttpError(
        HttpStatus.NOT_FOUND,
        "No preference found for this strategy",
      ),
    );

    return sendSuccessResponse(
      req,
      res,
      { data: preference, type: "single" } as any,
      { status: HttpStatus.SUCCESS },
    );
  },
);
