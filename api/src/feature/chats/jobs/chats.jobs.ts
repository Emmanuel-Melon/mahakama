import { logger } from "@/lib/logger";
import { ChatsJobs } from "../chats.config";
import { ChatsJobMap } from "../chats.types";
import { llmProviderManager } from "@/lib/llm";
import { sendMessage } from "@/feature/messages/operations/messages.create";
import { getChatById } from "../operations/chats.find";

export class ChatsJobHandler {
  static async handleMessageSent(
    data: ChatsJobMap[typeof ChatsJobs.MessageSent],
  ) {
    logger.info({ userId: data.userId }, "Processing message sent job");
    const client = llmProviderManager.getClient();
    const result = await client.generateTextContent("Hello");
    logger.info({ result }, "Message sent job result");
    return { success: true };
  }

  static async handleChatCreated(
    data: ChatsJobMap[typeof ChatsJobs.ChatCreated],
  ) {
    logger.info({ userId: data.userId }, "Processing chat created job");
    const chat = await getChatById(data.chatId);
    logger.info({ chat }, "Chat found");
    const client = llmProviderManager.getClient();
    const result = await client.generateTextContent("Hello");
    await sendMessage({
      chatId: chat.data?.id || "",
      content: result.content,
      senderType: "assistant",
      userId: data.userId,
    });
    logger.info({ result }, "Chat created job result");
    return { success: true };
  }
}
