import { Request, Response } from "express";
import { updateMatter } from "../operations/matter.update";
import type { UpdateMatter } from "../matter.types";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/lib/http/http.status";
import { MatterSerializer } from "../matter.config";
import { unwrap } from "@/lib/drizzle/drizzle.utils";
import { HttpError } from "@/lib/http/http.error";
import { asyncHandler } from "@/lib/express/express.async-handler";

export const updateMatterController = asyncHandler(
  async (req: Request, res: Response) => {
    const matterId = req.params.matterId as string;
    const body = req.body as UpdateMatter;

    const matter = unwrap(
      await updateMatter("id", matterId, body),
      new HttpError(
        HttpStatus.NOT_FOUND,
        "Matter not found or failed to update",
      ),
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
