import { Request, Response } from "express";
import {
  findMatter,
  findMatterLawyersByMatter,
} from "../operations/matter.find";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/lib/http/http.status";
import { MatterLawyerSerializer } from "../matter.config";
import { asyncHandler } from "@/lib/express/express.async-handler";
import { unwrap } from "@/lib/drizzle/drizzle.utils";
import { HttpError } from "@/lib/http/http.error";

export const getMatterLawyersController = asyncHandler(
  async (req: Request, res: Response) => {
    const matterId = req.params.matterId as string;

    unwrap(
      await findMatter("id", matterId),
      new HttpError(HttpStatus.NOT_FOUND, "Matter not found"),
    );

    const result = await findMatterLawyersByMatter(matterId);

    return sendSuccessResponse(
      req,
      res,
      {
        data: result.data,
        type: "collection",
        serializerConfig: MatterLawyerSerializer,
      },
      {
        status: HttpStatus.SUCCESS,
        additionalMeta: {
          total: result.data.length,
        },
      },
    );
  },
);
