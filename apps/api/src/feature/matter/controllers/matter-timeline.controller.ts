import { Request, Response } from "express";
import {
  findMatter,
  findMatterStatusHistoriesByMatter,
  findMatterEventsByMatter,
} from "../operations/matter.find";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/lib/http/http.status";
import { asyncHandler } from "@/lib/express/express.async-handler";
import { unwrap } from "@/lib/drizzle/drizzle.utils";
import { HttpError } from "@/lib/http/http.error";
import { JsonApiResourceConfig } from "@/lib/express/express.types";

const TimelineEntrySerializer: JsonApiResourceConfig<{
  id: string;
  type: string;
  timestamp: Date;
  data: Record<string, unknown>;
}> = {
  type: "matter-timeline-entry",
  attributes: (entry) => entry,
};

export const getMatterTimelineController = asyncHandler(
  async (req: Request, res: Response) => {
    const matterId = req.params.matterId as string;

    unwrap(
      await findMatter("id", matterId),
      new HttpError(HttpStatus.NOT_FOUND, "Matter not found"),
    );

    const [statusHistories, events] = await Promise.all([
      findMatterStatusHistoriesByMatter(matterId),
      findMatterEventsByMatter(matterId),
    ]);

    const timeline = [
      ...statusHistories.data.map((item) => ({
        id: item.id,
        type: "status_history",
        timestamp: item.createdAt,
        data: item,
      })),
      ...events.data.map((item) => ({
        id: item.id,
        type: "event",
        timestamp: item.eventAt,
        data: item,
      })),
    ].sort(
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
