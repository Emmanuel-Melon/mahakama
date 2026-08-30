import { Request, Response } from "express";
import {
  findMatter,
  findMatterStatusHistoriesByMatter,
  findMatterEventsByMatter,
  findMatterActivitiesByMatter,
} from "../operations/matter.find";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/lib/http/http.status";
import { asyncHandler } from "@/lib/express/express.async-handler";
import { unwrap } from "@/lib/drizzle/drizzle.utils";
import { HttpError } from "@/lib/http/http.error";
import { JsonApiResourceConfig } from "@/lib/express/express.types";

export type TimelineEntry = {
  id: string;
  source: "activity" | "status_history" | "event";
  type: string;
  title: string;
  description: string | null;
  actorUserId: string | null;
  timestamp: Date;
  isInternal: boolean;
  data: Record<string, unknown>;
};

const TimelineEntrySerializer: JsonApiResourceConfig<TimelineEntry> = {
  type: "matter-timeline-entry",
  attributes: (entry) => entry,
};

const toStatusLabel = (status: string) => status.replace(/_/g, " ");

export const getMatterTimelineController = asyncHandler(
  async (req: Request, res: Response) => {
    const matterId = req.params.matterId as string;
    const isLawyer = req.user?.role === "lawyer";

    unwrap(
      await findMatter("id", matterId),
      new HttpError(HttpStatus.NOT_FOUND, "Matter not found"),
    );

    const [statusHistories, events, activities] = await Promise.all([
      findMatterStatusHistoriesByMatter(matterId),
      findMatterEventsByMatter(matterId),
      findMatterActivitiesByMatter(matterId),
    ]);

    const timeline: TimelineEntry[] = [
      ...activities.data.map(
        (item) =>
          ({
            id: item.id,
            source: "activity",
            type: item.type,
            title: item.title,
            description: item.description,
            actorUserId: item.actorUserId,
            timestamp: item.createdAt,
            isInternal: item.isInternal,
            data: { ...item },
          }) as TimelineEntry,
      ),
      ...statusHistories.data.map(
        (item) =>
          ({
            id: item.id,
            source: "status_history",
            type: "status_history",
            title: item.fromStatus
              ? `Status changed from ${toStatusLabel(item.fromStatus)} to ${toStatusLabel(item.toStatus)}`
              : `Status changed to ${toStatusLabel(item.toStatus)}`,
            description: item.note,
            actorUserId: item.changedByUserId,
            timestamp: item.createdAt,
            isInternal: false,
            data: { ...item },
          }) as TimelineEntry,
      ),
      ...events.data.map(
        (item) =>
          ({
            id: item.id,
            source: "event",
            type: item.type,
            title: item.title,
            description: item.description,
            actorUserId: item.createdByUserId,
            timestamp: item.eventAt,
            isInternal: false,
            data: { ...item },
          }) as TimelineEntry,
      ),
    ]
      .filter((entry) => isLawyer || !entry.isInternal)
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      );

    return sendSuccessResponse(
      req,
      res,
      {
        data: timeline,
        type: "collection",
        serializerConfig: TimelineEntrySerializer,
      },
      {
        status: HttpStatus.SUCCESS,
        additionalMeta: {
          total: timeline.length,
        },
      },
    );
  },
);
