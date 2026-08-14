import { Request, Response } from "express";
import { sendMessage } from "../operations/messages.create";
import { getMessagesByChatId } from "../operations/messages.list";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/http-status";
import { MessageSerializer } from "../messages.config";
import { type User } from "@/feature/users/users.types";
import { asyncHandler } from "@/lib/express/express.asyncHandler";
import { HttpError } from "@/lib/http/http.error";
import { unwrap } from "@/lib/drizzle/drizzle.utils";
import { generateAssistantReply } from "@/service/rag-service/rag.answer";

export const sendMessageController = asyncHandler(
  async (req: Request, res: Response) => {
    const { chatId, content, userId } = req.body;
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

    const historyResult = unwrap(
      await getMessagesByChatId(chatId),
      new HttpError(HttpStatus.BAD_REQUEST, "Failed to load chat history"),
    );

    // RAG + LLM: build the prompt with conversation history and persist the
    // assistant reply (degrades to an un-answered message on failure).
    await generateAssistantReply({
      userMessage,
      history: historyResult.data,
      userId: user.id,
    });

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
