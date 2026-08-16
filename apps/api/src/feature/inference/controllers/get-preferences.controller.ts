import { Request, Response } from "express";
import { asyncHandler } from "@/lib/express/express.async-handler";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/lib/http/http.status";
import { findPreference } from "../operations/inference.find";

export const getPreferencesController = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await findPreference(
      req.params.userId as string,
      req.params.strategyKey as string,
    );

    return sendSuccessResponse(
      req,
      res,
      { data: result.data, type: "single" } as any,
      {
        status: HttpStatus.SUCCESS,
        additionalMeta: { total: result.ok ? 1 : 0 },
      },
    );
  },
);
