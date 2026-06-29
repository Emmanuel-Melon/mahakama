import { Request, Response } from "express";
import { deleteChat } from "../operations/chats.update";
import { User } from "@/feature/users/users.types";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/http-status";
import { asyncHandler } from "@/lib/express/express.asyncHandler";
import { unwrap } from "@/lib/drizzle/drizzle.utils";
import { HttpError } from "@/lib/http/http.error";

export const deleteChatController = asyncHandler(
  async (req: Request, res: Response) => {
    const chatId = req.params.chatId as string;
    const user = req.user as User;

    const deleted = unwrap(
      await deleteChat(chatId, user.id),
      new HttpError(HttpStatus.NOT_FOUND, "Chat not found"),
    );

    sendSuccessResponse(
      req,
      res,
      {
        data: { id: chatId, deleted: true } as {
          id: string;
          deleted: boolean;
        },
        type: "single",
        serializerConfig: {
          type: "chat",
          attributes: (resource) => ({
            deleted: resource.deleted,
          }),
        },
      },
      {
        status: HttpStatus.SUCCESS,
        additionalMeta: {
          message: "Resource successfully deleted",
          deletedAt: new Date().toISOString(),
        },
      },
    );
  },
);
