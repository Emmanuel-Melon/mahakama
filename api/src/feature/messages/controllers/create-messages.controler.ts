import { Request, Response } from "express";
import { sendMessage } from "../operations/messages.create";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/http-status";
import { MessageSerializer } from "../messages.config";
import { llmProviderManager } from "@/lib/llm";
import { type User } from "@/feature/users/users.types";
import { asyncHandler } from "@/lib/express/express.asyncHandler";
import { HttpError } from "@/lib/http/http.error";
import { unwrap } from "@/lib/drizzle/drizzle.utils";

export const sendMessageController = asyncHandler(
  async (req: Request, res: Response) => {
    const { chatId, content, userId, metadata } = req.body;
    const user = req.user as User;
    const senderType = user.role === "user" ? "user" : "assistant";

    const userMessage = unwrap(
      await sendMessage({
        chatId,
        content,
        senderType,
        userId,
      }),
      new HttpError(HttpStatus.BAD_REQUEST, "Failed to create user message"),
    );
    const client = llmProviderManager.getClient();
    const result = await client.generateTextContent(content);

    // const previousMessages = await getChatById(chatId);
    // console.log(previousMessages);
    const aiMessage = unwrap(
      await sendMessage({
        chatId,
        content: result.content,
        senderType: "assistant",
        userId: user.id,
      }),
      new HttpError(HttpStatus.BAD_REQUEST, "Failed to create AI message"),
    );

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
