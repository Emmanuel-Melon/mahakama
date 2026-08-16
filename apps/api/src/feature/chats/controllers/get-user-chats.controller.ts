import { Request, Response } from "express";
import { findChats } from "../operations/chats.find";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/lib/http/http.status";
import { ChatSerializer } from "../chats.config";
import { asyncHandler } from "@/lib/express/express.async-handler";
import { parsePagination } from "@/lib/express/express.query";

export const getUserChatsController = asyncHandler(
  async (req: Request, res: Response) => {
    const pagination = parsePagination(req);
    const chats = await findChats(req.user?.id!, pagination);
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
