import { Request, Response } from "express";
import { findMatters, findMatter } from "../operations/matter.find";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/lib/http/http.status";
import { MatterSerializer } from "../matter.config";
import { asyncHandler } from "@/lib/express/express.async-handler";
import { unwrap } from "@/lib/drizzle/drizzle.utils";
import { HttpError } from "@/lib/http/http.error";
import { MattersFilters } from "../matter.types";

export const getMattersController = asyncHandler(
  async (req: Request, res: Response) => {
    const query = req.query as unknown as MattersFilters;
    const result = await findMatters(query);
    return sendSuccessResponse(
      req,
      res,
      {
        data: result.data,
        serializerConfig: MatterSerializer,
        type: "collection",
      },
      {
        status: HttpStatus.SUCCESS,
        additionalMeta: {
          total: result.count,
        },
      },
    );
  },
);
