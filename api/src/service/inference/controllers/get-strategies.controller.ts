import { Request, Response } from "express";
import { asyncHandler } from "@/lib/express/express.asyncHandler";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/lib/http/http.status";
import { getInferenceStrategies } from "../operations/inference.find";
import { SerializedStrategy } from "../inference.config";

export const getStrategiesController = asyncHandler(
  async (req: Request, res: Response) => {
    const strategies = await getInferenceStrategies();

    return sendSuccessResponse(
      req,
      res,
      {
        data: strategies.data,
        serializerConfig: SerializedStrategy,
        type: "collection",
      },
      {
        status: HttpStatus.SUCCESS,
        additionalMeta: {
          total: strategies.count,
        },
      },
    );
  },
);
