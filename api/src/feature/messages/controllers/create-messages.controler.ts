import { Request, Response } from "express";
import { sendMessage } from "../operations/messages.create";
import { getMessagesByChatId } from "../operations/messages.list";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { HttpStatus } from "@/http-status";
import { MessageSerializer } from "../messages.config";
import { llmProviderManager } from "@/lib/llm";
import { type User } from "@/feature/users/users.types";
import { asyncHandler } from "@/lib/express/express.asyncHandler";
import { HttpError } from "@/lib/http/http.error";
import { unwrap } from "@/lib/drizzle/drizzle.utils";
import { buildRagContext } from "@/service/rag-service/rag.context";
import { buildRagChatPrompt } from "@/service/rag-service/rag.prompts";

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

    // RAG: retrieve legal context (degrades to empty on failure) and build the
    // prompt with conversation history.
    const { context, conversationHistory } = await buildRagContext(
      userMessage,
      historyResult.data,
    );

    const prompt = buildRagChatPrompt(content, conversationHistory, context);

    const client = llmProviderManager.getClient();
    const result = await client.generateTextContent(prompt);

    const aiMessage = unwrap(
      await sendMessage({
        chatId,
        content: result.content,
        senderType: "assistant",
        userId: user.id,
        metadata: context.sources.length ? { sources: context.sources } : undefined,
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
