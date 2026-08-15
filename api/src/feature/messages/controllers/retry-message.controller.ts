import { Request, Response } from "express";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/lib/http/http.status";
import { MessageSerializer } from "../messages.config";
import { asyncHandler } from "@/lib/express/express.async-handler";
import { HttpError } from "@/lib/http/http.error";
import { unwrap } from "@/lib/drizzle/drizzle.utils";
import { getMessageById } from "../operations/messages.find";
import {
  REPLY_STATUS,
  updateMessageReplyStatus,
} from "../operations/messages.update";
import { chatsQueue } from "@/feature/chats/jobs/chats.queue";
import { ChatsJobs } from "@/feature/chats/chats.config";
import { logger } from "@/lib/logger";

export const retryMessageController = asyncHandler(
  async (req: Request, res: Response) => {
    const messageId = req.params.messageId as string;
    const user = req.user as { id: string };

    const message = unwrap(
      await getMessageById(messageId),
      new HttpError(HttpStatus.NOT_FOUND, "Message not found"),
    );

    if (message.senderType !== "user") {
      throw new HttpError(
        HttpStatus.BAD_REQUEST,
        "Only user messages can be retried",
      );
    }

    if (!message.userId) {
      throw new HttpError(
        HttpStatus.BAD_REQUEST,
        "Message has no associated user",
      );
    }

    const retried = unwrap(
      await updateMessageReplyStatus(messageId, REPLY_STATUS.PENDING),
      new HttpError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "Failed to reset reply status",
      ),
    );

    // Best-effort — the reply status is reset regardless of enqueue success.
    try {
      await chatsQueue.add(ChatsJobs.MessageSent, {
        userId: user.id,
        messageId,
      });
    } catch (error) {
      logger.error({ error, messageId }, "Failed to enqueue retry job");
    }

    sendSuccessResponse(req, res, {
      data: {
        ...retried,
        id: retried.id.toString(),
      } as typeof retried & {
        id: string;
      },
      type: "single",
      serializerConfig: MessageSerializer,
    });
  },
);
