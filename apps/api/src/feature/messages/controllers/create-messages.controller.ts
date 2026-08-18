import { Request, Response } from "express";
import { sendMessage } from "../operations/messages.create";
import { HttpStatus } from "@/lib/http/http.status";
import { MessageSerializer } from "../messages.config";
import { type User } from "@/feature/users/users.types";
import { asyncHandler } from "@/lib/express/express.async-handler";
import { HttpError } from "@/lib/http/http.error";
import { unwrap } from "@/lib/drizzle/drizzle.utils";
import { chatsQueue } from "@/feature/chats/jobs/chats.queue";
import { ChatsJobs } from "@/feature/chats/chats.config";
import { logger } from "@/lib/logger";
import { handleSSEStream } from "@/lib/express/express.sse";
import { subscribeChat } from "@/feature/chats/chat.progress";
import { ChatStreamEventTypes } from "@/feature/chats/chat.events";

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

    // Immediately return the user message so the client can display it,
    // then open an SSE stream for the assistant's streaming reply.
    const userMessageResponse = {
      ...userMessage,
      id: userMessage.id.toString(),
    } as typeof userMessage & { id: string };

    // Send the user message as the first SSE event so the client has it
    // before the stream starts.
    handleSSEStream(
      res,
      async (sse, closeStream) => {
        sse.sendEvent({
          type: "user_message",
          data: userMessageResponse,
        });

        // Subscribe before enqueueing so we don't miss early events
        const unsubscribe = subscribeChat(chatId, (event) => {
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
          logger.error({ error, chatId }, "Failed to enqueue reply job");
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
          name: "sendMessageController",
          requestId: req.requestId,
          route: req.path,
          resourceId: chatId,
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
