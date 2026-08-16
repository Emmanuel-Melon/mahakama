import { Request, Response } from "express";
import { asyncHandler } from "@/lib/express/express.async-handler";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/lib/http/http.status";
import { SerializedPreference } from "../inference.config";
import { upsertUserPreference } from "../operations/inference.insert";
import { unwrap } from "@/lib/drizzle/drizzle.utils";

export const upsertPreferenceController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.params.userId as string;
    const strategyKey = req.params.strategyKey as string;
    const { providerId, modelId } = req.body;

    const preference = unwrap(
      await upsertUserPreference({ userId, strategyKey, providerId, modelId }),
    );

    return sendSuccessResponse(
      req,
      res,
      {
        data: preference,
        serializerConfig: SerializedPreference,
        type: "single",
      },
      {
        status: HttpStatus.SUCCESS,
      },
    );
  },
);
