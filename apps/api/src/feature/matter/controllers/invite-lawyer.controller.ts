import { Request, Response } from "express";
import {
  findMatter,
  findMatterLawyersByMatter,
} from "../operations/matter.find";
import {
  insertMatterLawyer,
  recordMatterActivity,
} from "../operations/matter.insert";
import type { NewMatterLawyer } from "../matter.types";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/lib/http/http.status";
import { MatterLawyerSerializer, MattersJobs } from "../matter.config";
import { unwrap } from "@/lib/drizzle/drizzle.utils";
import { HttpError } from "@/lib/http/http.error";
import { asyncHandler } from "@/lib/express/express.async-handler";
import { logger } from "@/lib/logger";
import { matterQueue } from "../jobs/matter.queue";

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

    const existing = await findMatterLawyersByMatter(matterId);
    if (existing.data.some((lawyer) => lawyer.lawyerId === body.lawyerId)) {
      throw new HttpError(
        HttpStatus.CONFLICT,
        "Lawyer is already assigned to this matter",
      );
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

    await recordMatterActivity({
      matterId,
      actorUserId: req.user?.id ?? null,
      type: "lawyer_invited",
      title: "Lawyer invited",
      metadata: { lawyerId: body.lawyerId, role: body.role ?? "primary" },
    });

    // Kick off the side-effect workflow for the invite (notifications, etc.).
    try {
      await matterQueue.add(MattersJobs.LawyerInvitedToMatter, {
        matterId,
        lawyerId: body.lawyerId,
        invitedByUserId: req.user?.id,
      });
    } catch (error) {
      logger.error(
        { error, matterId, lawyerId: body.lawyerId },
        "Failed to enqueue lawyer-invited-to-matter job",
      );
    }

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
