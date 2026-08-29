import { Request, Response } from "express";
import { findMatter } from "../operations/matter.find";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/lib/http/http.status";
import { MatterSerializer } from "../matter.config";
import { asyncHandler } from "@/lib/express/express.async-handler";
import { unwrap } from "@/lib/drizzle/drizzle.utils";
import { HttpError } from "@/lib/http/http.error";
import { MattersFilters } from "../matter.types";

export const getMatterController = asyncHandler(
  async (req: Request, res: Response) => {
    const matterId = req.params.id as string;
    const matter = unwrap(
      await findMatter("id", matterId),
      new HttpError(HttpStatus.NOT_FOUND, "Matter not found"),
    );
    return sendSuccessResponse(
      req,
      res,
      {
        data: {
          ...matter,
        },
        serializerConfig: MatterSerializer,
        type: "single",
      },
      {
        status: HttpStatus.SUCCESS,
      },
    );
  },
);
