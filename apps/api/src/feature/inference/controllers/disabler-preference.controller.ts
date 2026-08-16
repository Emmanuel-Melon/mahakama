import { Request, Response } from "express";
import { asyncHandler } from "@/lib/express/express.async-handler";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/lib/http/http.status";
import { deleteUserPreference } from "../operations/inference.update";

// Resets to strategy default, next run will use preferredProvider again.
export const disablePreferenceController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.params.userId as string;
    const strategyKey = req.params.strategyKey as string;
    await deleteUserPreference(userId, strategyKey);
    return sendSuccessResponse(
      req,
      res,
      { data: null, type: "single" } as any,
      { status: HttpStatus.SUCCESS },
    );
  },
);
