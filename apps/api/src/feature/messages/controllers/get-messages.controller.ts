import { Request, Response } from "express";
import { getMessagesByChatId } from "../operations/messages.list";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/lib/http/http.status";
import { MessageSerializer } from "../messages.config";
import { asyncHandler } from "@/lib/express/express.async-handler";

export const getMessagesByChatIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const chatId = req.params.chatId as string;

    const messages = await getMessagesByChatId(chatId);

    sendSuccessResponse(
      req,
      res,
      {
        data: messages.data.map((message) => ({
          ...message,
          id: message.id.toString(),
        })),
        type: "collection",
        serializerConfig: MessageSerializer,
      },
      {
        status: HttpStatus.SUCCESS,
      },
    );
  },
);
