import { Request, Response } from "express";
import { findMatter } from "../operations/matter.find";
import { insertMatterLawyer } from "../operations/matter.insert";
import type { NewMatterLawyer } from "../matter.types";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/lib/http/http.status";
import { MatterLawyerSerializer } from "../matter.config";
import { unwrap } from "@/lib/drizzle/drizzle.utils";
import { HttpError } from "@/lib/http/http.error";
import { asyncHandler } from "@/lib/express/express.async-handler";

export const createMatterLawyerController = asyncHandler(
  async (req: Request, res: Response) => {
    const matterId = req.params.matterId as string;
    const body = req.body as Partial<NewMatterLawyer>;

    unwrap(
      await findMatter("id", matterId),
      new HttpError(HttpStatus.NOT_FOUND, "Matter not found"),
    );

    if (!body.lawyerId) {
      throw new HttpError(HttpStatus.BAD_REQUEST, "Lawyer ID is required");
    }

    const matterLawyer = unwrap(
      await insertMatterLawyer({
        ...body,
        matterId,
        lawyerId: body.lawyerId,
      }),
      new HttpError(
        HttpStatus.BAD_REQUEST,
        "Failed to assign lawyer to matter",
      ),
    );

    return sendSuccessResponse(
      req,
      res,
      {
        data: {
          ...matterLawyer,
        },
        serializerConfig: MatterLawyerSerializer,
        type: "single",
      },
      {
        status: HttpStatus.CREATED,
      },
    );
  },
);
