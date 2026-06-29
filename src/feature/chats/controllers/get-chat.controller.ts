import { Request, Response } from "express";
import { getChatById } from "../operations/chats.find";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/http-status";
import { ChatSerializer } from "../chats.config";
import { asyncHandler } from "@/lib/express/express.asyncHandler";
import { unwrap } from "@/lib/drizzle/drizzle.utils";
import { HttpError } from "@/lib/http/http.error";

export const getChatController = asyncHandler(
  async (req: Request, res: Response) => {
    const chatId = req.params.chatId as string;
    const chat = unwrap(
      await getChatById(chatId),
      new HttpError(HttpStatus.NOT_FOUND, "Chat not found"),
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
        status: HttpStatus.SUCCESS,
      },
    );
  },
);
