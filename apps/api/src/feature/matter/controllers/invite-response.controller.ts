import { Request, Response } from "express";
import { db } from "@/lib/drizzle";
import { matterLawyersTable } from "../matter.schema";
import type { UpdateMatterLawyer } from "../matter.types";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/lib/http/http.status";
import { MatterLawyerSerializer } from "../matter.config";
import { HttpError } from "@/lib/http/http.error";
import { asyncHandler } from "@/lib/express/express.async-handler";
import { and, eq } from "drizzle-orm";

export const updateMatterLawyerMeController = asyncHandler(
  async (req: Request, res: Response) => {
    const matterId = req.params.matterId as string;
    const lawyerId = req.user?.id;
    const body = req.body as UpdateMatterLawyer;

    if (!lawyerId) {
      throw new HttpError(HttpStatus.UNAUTHORIZED, "Unauthorized");
    }

    const [updatedLawyer] = await db
      .update(matterLawyersTable)
      .set(body)
      .where(
        and(
          eq(matterLawyersTable.matterId, matterId),
          eq(matterLawyersTable.lawyerId, lawyerId),
        ),
      )
      .returning();

    if (!updatedLawyer) {
      throw new HttpError(
        HttpStatus.NOT_FOUND,
        "Matter lawyer assignment not found",
      );
    }

    return sendSuccessResponse(
      req,
      res,
      {
        data: {
          ...updatedLawyer,
        },
        serializerConfig: MatterLawyerSerializer,
        type: "single",
      },
      {
        status: HttpStatus.SUCCESS,
      },
    );
  },
);
