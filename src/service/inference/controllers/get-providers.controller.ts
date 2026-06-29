import { Request, Response } from "express";
import { asyncHandler } from "@/lib/express/express.asyncHandler";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/lib/http/http.status";
import { SerializedProvider } from "../inference.config";
import { getInferenceProviders } from "../operations/inference.find";

export const getProvidersController = asyncHandler(
  async (req: Request, res: Response) => {
    const providers = await getInferenceProviders();

    return sendSuccessResponse(
      req,
      res,
      {
        data: providers.data,
        serializerConfig: SerializedProvider,
        type: "collection",
      },
      {
        status: HttpStatus.SUCCESS,
        additionalMeta: {
          total: providers.count,
        },
      },
    );
  },
);
