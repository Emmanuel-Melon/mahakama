import { QueueName } from "@/lib/bullmq/bullmq.config";
import { createBullWorker } from "@/lib/bullmq";
import { ChatsJobs } from "../chats.config";
import { ChatsJobHandler } from "./chats.jobs";
import { JobHandlerMap } from "@/lib/bullmq/bullmq.types";
import { ChatsJobMap } from "../chats.types";

const chatsHandlers: JobHandlerMap<ChatsJobMap> = {
  [ChatsJobs.MessageSent]: (data) => ChatsJobHandler.handleMessageSent(data),
  [ChatsJobs.ChatCreated]: (data) => ChatsJobHandler.handleChatCreated(data),
};

export const initChatsWorker = () =>
  createBullWorker<ChatsJobMap>(QueueName.Chat, chatsHandlers);
