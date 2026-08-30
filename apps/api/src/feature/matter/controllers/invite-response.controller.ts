import { Request, Response } from "express";
import { db } from "@/lib/drizzle";
import { matterLawyersTable } from "../matter.schema";
import { recordMatterActivity } from "../operations/matter.insert";
import type { UpdateMatterLawyer } from "../matter.types";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/lib/http/http.status";
import { MatterLawyerSerializer } from "../matter.config";
import { HttpError } from "@/lib/http/http.error";
import { asyncHandler } from "@/lib/express/express.async-handler";
import { findLawyer } from "@/feature/lawyers/operations/lawyers.find";
import { unwrap } from "@/lib/drizzle/drizzle.utils";
import type { User } from "@/feature/users/users.types";
import { and, eq } from "drizzle-orm";

export const updateMatterLawyerMeController = asyncHandler(
  async (req: Request, res: Response) => {
    const matterId = req.params.matterId as string;
    const user = req.user as User | undefined;
    const body = req.body as UpdateMatterLawyer;

    if (!user?.id) {
      throw new HttpError(HttpStatus.UNAUTHORIZED, "Unauthorized");
    }

    const lawyer = unwrap(
      await findLawyer("userId", user.id),
      new HttpError(HttpStatus.NOT_FOUND, "No lawyer profile found"),
    );

    const accepted = body.status === "accepted";
    const updateData: UpdateMatterLawyer = {
      ...body,
      acceptedAt: accepted ? new Date() : null,
    };

    const [updatedLawyer] = await db
      .update(matterLawyersTable)
      .set(updateData)
      .where(
        and(
          eq(matterLawyersTable.matterId, matterId),
          eq(matterLawyersTable.lawyerId, lawyer.id),
        ),
      )
      .returning();

    if (!updatedLawyer) {
      throw new HttpError(
        HttpStatus.NOT_FOUND,
        "Matter lawyer assignment not found",
      );
    }

    if (body.status === "accepted" || body.status === "declined") {
      await recordMatterActivity({
        matterId,
        actorUserId: user.id,
        type: body.status === "accepted" ? "lawyer_accepted" : "lawyer_declined",
        title:
          body.status === "accepted" ? "Lawyer accepted" : "Lawyer declined",
        metadata: { lawyerId: lawyer.id },
      });
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
