import { logger } from "@/lib/logger";
import { ChatsJobs } from "../chats.config";
import { ChatsJobMap } from "../chats.types";
import { getMessageById } from "@/feature/messages/operations/messages.find";
import {
  updateMessageReplyStatus,
  REPLY_STATUS,
} from "@/feature/messages/operations/messages.update";
import { getMessagesByChatId } from "@/feature/messages/operations/messages.list";
import { generateAssistantReply } from "@/service/rag-service/rag.answer";
import { unwrap } from "@/lib/drizzle/drizzle.utils";
import { HttpError } from "@/lib/http/http.error";
import { HttpStatus } from "@/http-status";

export class ChatsJobHandler {
  static async handleMessageSent(
    data: ChatsJobMap[typeof ChatsJobs.MessageSent],
  ) {
    const { messageId, userId } = data;
    logger.info({ userId, messageId }, "Processing message sent job");

    const userMessage = unwrap(
      await getMessageById(messageId),
      new HttpError(HttpStatus.NOT_FOUND, "User message not found"),
    );

    try {
      const { data: history } = await getMessagesByChatId(userMessage.chatId);

      await generateAssistantReply({
        userMessage,
        history,
        userId,
      });

      await updateMessageReplyStatus(messageId, REPLY_STATUS.COMPLETED);
      return { success: true };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to generate reply";
      logger.error(
        { error, messageId, chatId: userMessage.chatId },
        "Failed to generate assistant reply",
      );
      await updateMessageReplyStatus(
        messageId,
        REPLY_STATUS.FAILED,
        errorMessage,
      );
      throw error; // Rethrow so BullMQ retries per defaultBullJobOptions
    }
  }

  static async handleChatCreated(
    data: ChatsJobMap[typeof ChatsJobs.ChatCreated],
  ) {
    const { userId, chatId } = data;
    logger.info({ userId, chatId }, "Processing chat created job");
    const { data: history } = await getMessagesByChatId(chatId);
    const firstUserMessage = history.find((m) => m.senderType === "user");
    if (!firstUserMessage) {
      return { success: true };
    }
    return this.handleMessageSent({
      userId,
      messageId: firstUserMessage.id,
    });
  }
}
