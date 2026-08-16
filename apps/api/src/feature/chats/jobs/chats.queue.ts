import { queueManager } from "@/lib/bullmq";
import { QueueName } from "@/lib/bullmq/bullmq.config";
import { ChatsJobMap } from "../chats.types";

export const chatsQueue = queueManager.getQueue<ChatsJobMap[keyof ChatsJobMap]>(
  QueueName.Chat,
);
