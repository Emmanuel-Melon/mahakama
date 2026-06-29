import { Request, Response } from "express";
import { asyncHandler } from "@/lib/express/express.asyncHandler";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/lib/http/http.status";
import { disabletInferencePreference } from "../operations/inference.update";

// Resets to strategy default, next run will use preferredProvider again.
export const disablePreferenceController = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId, strategyKey } = req.params;
    await disabletInferencePreference(userId, strategyKey);
    return sendSuccessResponse(
      req,
      res,
      { data: null, type: "single" } as any,
      { status: HttpStatus.SUCCESS },
    );
  },
);
