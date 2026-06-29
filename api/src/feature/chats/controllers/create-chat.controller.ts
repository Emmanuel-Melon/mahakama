import { Request, Response } from "express";
import { createChat } from "../operations/chats.create";
import type { User } from "@/feature/users/users.types";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/http-status";
import { ChatSerializer, ChatsJobs } from "../chats.config";
import { sendMessage } from "@/feature/messages/operations/messages.create";
import { UserRoles } from "@/feature/users/users.schema";
import { asyncHandler } from "@/lib/express/express.asyncHandler";
import { unwrap } from "@/lib/drizzle/drizzle.utils";
import { HttpError } from "@/lib/http/http.error";
import { chatsQueue } from "../jobs/chats.queue";

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
    unwrap(
      await sendMessage({
        chatId: chat.id,
        content: message,
        senderType,
        userId: user.id,
      }),
      new HttpError(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to send message"),
    );
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
    chatsQueue.add(ChatsJobs.ChatCreated, {
      userId: user.id,
      chatId: chat.id,
    });
  },
);
