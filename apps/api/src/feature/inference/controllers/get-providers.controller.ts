import { Request, Response } from "express";
import { asyncHandler } from "@/lib/express/express.async-handler";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/lib/http/http.status";
import { SerializedProvider } from "../inference.config";
import { findInferenceProviders } from "../operations/inference.find";

export const getProvidersController = asyncHandler(
  async (req: Request, res: Response) => {
    const providers = await findInferenceProviders();

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
