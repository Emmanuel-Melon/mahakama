import { Request, Response } from "express";
import { updateMatter } from "../operations/matter.update";
import { findMatter } from "../operations/matter.find";
import { insertMatterStatusHistory, recordMatterActivity } from "../operations/matter.insert";
import type { UpdateMatter } from "../matter.types";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/lib/http/http.status";
import { MatterSerializer } from "../matter.config";
import { unwrap } from "@/lib/drizzle/drizzle.utils";
import { HttpError } from "@/lib/http/http.error";
import { asyncHandler } from "@/lib/express/express.async-handler";

const MATTER_STATUSES = [
  "draft",
  "open",
  "waiting_client",
  "waiting_lawyer",
  "in_progress",
  "resolved",
  "closed",
  "archived",
] as const;

type MatterStatus = (typeof MATTER_STATUSES)[number];

const isStatus = (value: unknown): value is MatterStatus =>
  MATTER_STATUSES.includes(value as MatterStatus);

const metadataNote = (body: UpdateMatter): string | null => {
  if (
    body.metadata &&
    typeof body.metadata === "object" &&
    !Array.isArray(body.metadata)
  ) {
    const note = (body.metadata as Record<string, unknown>).note;
    return typeof note === "string" ? note : null;
  }
  return null;
};

export const updateMatterController = asyncHandler(
  async (req: Request, res: Response) => {
    const matterId = req.params.matterId as string;
    const body = req.body as UpdateMatter;

    const existing = unwrap(
      await findMatter("id", matterId),
      new HttpError(
        HttpStatus.NOT_FOUND,
        "Matter not found or failed to update",
      ),
    );

    const matter = unwrap(
      await updateMatter("id", matterId, body),
      new HttpError(
        HttpStatus.NOT_FOUND,
        "Matter not found or failed to update",
      ),
    );

    // When the status changes, append to the status history and add an
    // activity entry so the change shows up on the matter timeline.
    const fromStatus = existing.status;
    const toStatus = body.status;
    if (toStatus && toStatus !== fromStatus && isStatus(toStatus)) {
      const note = metadataNote(body);
      await insertMatterStatusHistory({
        matterId,
        fromStatus: isStatus(fromStatus) ? fromStatus : null,
        toStatus,
        changedByUserId: req.user?.id ?? null,
        note,
      });
      await recordMatterActivity({
        matterId,
        actorUserId: req.user?.id ?? null,
        type: "status_changed",
        title: `Status changed to ${toStatus.replace(/_/g, " ")}`,
        description: note,
        metadata: {
          fromStatus,
          toStatus,
          note,
        },
      });
    }

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