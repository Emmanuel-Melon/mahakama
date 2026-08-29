import { Request, Response } from "express";
import { insertMatter } from "../operations/matter.insert";
import type { NewMatter } from "../matter.types";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/lib/http/http.status";
import { MatterSerializer } from "../matter.config";
import { unwrap } from "@/lib/drizzle/drizzle.utils";
import { HttpError } from "@/lib/http/http.error";
import { asyncHandler } from "@/lib/express/express.async-handler";

export const openMatterController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = req.body as NewMatter;
    const clientUserId = req.user?.id || body.clientUserId;

    if (!clientUserId) {
      throw new HttpError(HttpStatus.BAD_REQUEST, "Client user ID is required");
    }

    const matter = unwrap(
      await insertMatter({
        ...body,
        clientUserId,
      }),
      new HttpError(HttpStatus.BAD_REQUEST, "Failed to create matter"),
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
