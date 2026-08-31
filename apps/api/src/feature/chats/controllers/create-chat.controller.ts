import { Request, Response } from "express";
import { createChat } from "../operations/chats.create";
import type { User } from "@/feature/users/users.types";
import { HttpStatus } from "@/lib/http/http.status";
import { sendMessage } from "@/feature/messages/operations/messages.create";
import { chatsQueue } from "../jobs/chats.queue";
import { ChatsJobs } from "../chats.config";
import { UserRoles } from "@/feature/users/users.schema";
import { asyncHandler } from "@/lib/express/express.async-handler";
import { unwrap } from "@/lib/drizzle/drizzle.utils";
import { HttpError } from "@/lib/http/http.error";
import { logger } from "@/lib/logger";
import { handleSSEStream } from "@/lib/express/express.sse";
import { subscribeChat } from "../chat.progress";
import { ChatStreamEventTypes } from "../chat.events";

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

    logger.info({ chat }, "My chat");

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

    const chatResponse = {
      ...chat,
      id: chat.id.toString(),
    } as typeof chat & { id: string };

    const userMessageResponse = {
      ...userMessage,
      id: userMessage.id.toString(),
    } as typeof userMessage & { id: string };

    handleSSEStream(
      res,
      async (sse, closeStream) => {
        sse.sendEvent({
          type: "chat_created",
          data: { chat: chatResponse, userMessage: userMessageResponse },
        });

        const unsubscribe = subscribeChat(chat.id, (event) => {
          if (event.type === ChatStreamEventTypes.Completed) {
            unsubscribe();
            sse.sendEvent(event);
            closeStream();
            return;
          }
          if (event.type === ChatStreamEventTypes.Error) {
            unsubscribe();
            sse.sendEvent(event);
            closeStream();
            return;
          }
          sse.sendEvent(event);
        });

        res.on("close", () => unsubscribe());

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
          unsubscribe();
          sse.sendError({
            message: "Failed to enqueue reply job",
            code: "REPLY_ENQUEUE_FAILED",
          });
          closeStream();
        }
      },
      {
        maxWaitMs: 300_000, // 5 minutes
        metadata: {
          name: "createChatController",
          requestId: req.requestId,
          route: req.path,
          resourceId: chat.id.toString(),
        },
        onTimeout: (sendError, close) => {
          sendError({
            message: "Reply generation timed out",
            code: "REPLY_TIMEOUT",
          });
          close();
        },
      },
    );
  },
);
