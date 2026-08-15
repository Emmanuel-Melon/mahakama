import { Request, Response } from "express";
import { createChat } from "../operations/chats.create";
import type { User } from "@/feature/users/users.types";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/http-status";
import { ChatSerializer } from "../chats.config";
import { sendMessage } from "@/feature/messages/operations/messages.create";
import { chatsQueue } from "../jobs/chats.queue";
import { ChatsJobs } from "../chats.config";
import { UserRoles } from "@/feature/users/users.schema";
import { asyncHandler } from "@/lib/express/express.asyncHandler";
import { unwrap } from "@/lib/drizzle/drizzle.utils";
import { HttpError } from "@/lib/http/http.error";
import { logger } from "@/lib/logger";

export const createChatController = asyncHandler(
  async (req: Request<{}, {}, any>, res: Response) => {
    const { message, metadata: bodyMetadata } = req.body;
    const user = req.user as User;
    const senderType = user.role === UserRoles.USER ? "user" : "assistant";
    const chat = unwrap(
      await createChat({
        userId: user.id,
        title: message,
        metadata: bodyMetadata,
      }),
      new HttpError(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to create chat"),
    );
    const userMessage = unwrap(
      await sendMessage({
        chatId: chat.id,
        content: message,
        senderType,
        userId: user.id,
        metadata: { ...(bodyMetadata || {}), replyStatus: "pending" },
      }),
      new HttpError(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to send message"),
    );

    // Answer the first message asynchronously so the chat and user message are
    // returned immediately. Best-effort — the chat + user message are created
    // regardless of whether the job can be enqueued (e.g. Redis down).
    try {
      await chatsQueue.add(ChatsJobs.MessageSent, {
        userId: user.id,
        messageId: userMessage.id,
      });
    } catch (error) {
      logger.error(
        { error, chatId: chat.id },
        "Failed to enqueue reply job for new chat",
      );
    }

    sendSuccessResponse(
      req,
      res,
      {
        data: {
          ...chat,
          id: chat.id.toString(),
        } as typeof chat & { id: string },
        type: "single",
        serializerConfig: ChatSerializer,
      },
      {
        status: HttpStatus.CREATED,
      },
    );
  },
);
