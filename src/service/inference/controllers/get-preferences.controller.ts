import { Request, Response } from "express";
import { asyncHandler } from "@/lib/express/express.asyncHandler";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/lib/http/http.status";
import { findUserPreference } from "../operations/inference.find";

export const getPreferencesController = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await findUserPreference(
      req.params.userId,
      req.params.strategyKey,
    );

    return sendSuccessResponse(
      req,
      res,
      { data: result, type: "single" } as any,
      { status: HttpStatus.SUCCESS, additionalMeta: { total: result ? 1 : 0 } },
    );
  },
);
