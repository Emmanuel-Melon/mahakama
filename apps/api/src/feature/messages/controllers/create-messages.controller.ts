import { Request, Response } from "express";
import { sendMessage } from "../operations/messages.create";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/lib/http/http.status";
import { MessageSerializer } from "../messages.config";
import { type User } from "@/feature/users/users.types";
import { asyncHandler } from "@/lib/express/express.async-handler";
import { HttpError } from "@/lib/http/http.error";
import { unwrap } from "@/lib/drizzle/drizzle.utils";
import { chatsQueue } from "@/feature/chats/jobs/chats.queue";
import { ChatsJobs } from "@/feature/chats/chats.config";
import { logger } from "@/lib/logger";

export const sendMessageController = asyncHandler(
  async (req: Request, res: Response) => {
    const { chatId, content, userId, metadata: bodyMetadata } = req.body;
    const user = req.user as User;
    const senderType = user.role === "user" ? "user" : "assistant";

    const userMessage = unwrap(
      await sendMessage({
        chatId,
        content,
        senderType,
        userId,
        metadata: { ...(bodyMetadata || {}), replyStatus: "pending" },
      }),
      new HttpError(HttpStatus.BAD_REQUEST, "Failed to create user message"),
    );

    // Answer the message asynchronously so the user message is returned
    // immediately. Best-effort — the user message is saved regardless of
    // whether the job can be enqueued (e.g. Redis down).
    try {
      await chatsQueue.add(ChatsJobs.MessageSent, {
        userId: user.id,
        messageId: userMessage.id,
      });
    } catch (error) {
      logger.error({ error, chatId }, "Failed to enqueue reply job");
    }

    sendSuccessResponse(
      req,
      res,
      {
        data: {
          ...userMessage,
          id: userMessage.id.toString(),
        } as typeof userMessage & {
          id: string;
        },
        type: "single",
        serializerConfig: MessageSerializer,
      },
      {
        status: HttpStatus.CREATED,
      },
    );
  },
);
