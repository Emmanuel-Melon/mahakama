import { Request, Response } from "express";
import { getUserChats } from "../operations/chats.find";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/http-status";
import { ChatSerializer } from "../chats.config";
import { asyncHandler } from "@/lib/express/express.asyncHandler";
import { parsePagination } from "@/lib/express/express.query";

export const getUserChatsController = asyncHandler(
  async (req: Request, res: Response) => {
    const pagination = parsePagination(req);
    const chats = await getUserChats(req.user?.id!, pagination);
    sendSuccessResponse(
      req,
      res,
      {
        data: chats.data,
        type: "collection",
        serializerConfig: ChatSerializer,
      },
      {
        status: HttpStatus.SUCCESS,
      },
    );
  },
);
