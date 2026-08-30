import { Request, Response } from "express";
import {
  insertMatter,
  recordMatterActivity,
} from "../operations/matter.insert";
import type { NewMatter } from "../matter.types";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/lib/http/http.status";
import { MatterSerializer } from "../matter.config";
import { unwrap } from "@/lib/drizzle/drizzle.utils";
import { HttpError } from "@/lib/http/http.error";
import { asyncHandler } from "@/lib/express/express.async-handler";
import { logger } from "@/lib/logger";
import { matterQueue } from "../jobs/matter.queue";
import { MattersJobs } from "../matter.config";

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

    // When a matter is opened from a chat, kick off the background job that
    // reads the conversation and fills in the draft title/summary/details.
    // That handler chains a dedicated summary-generation pass afterwards.
    if (body.sourceChatId) {
      try {
        await matterQueue.add(MattersJobs.MatterFromChat, {
          chatId: body.sourceChatId,
          clientUserId,
          matterId: matter.id,
        });
      } catch (error) {
        logger.error(
          { error, chatId: body.sourceChatId, matterId: matter.id },
          "Failed to enqueue matter-from-chat job",
        );
      }
    }

    await recordMatterActivity({
      matterId: matter.id,
      actorUserId: clientUserId,
      type: "matter_created",
      title: "Matter opened",
      metadata: {
        fromChat: Boolean(body.sourceChatId),
        sourceChatId: body.sourceChatId ?? null,
      },
    });

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
