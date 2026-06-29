import { queueManager } from "@/lib/bullmq";
import { QueueName } from "@/lib/bullmq/bullmq.config";
import { MessageJobMap } from "../messages.types";

export const messagesQueue = queueManager.getQueue<
  MessageJobMap[keyof MessageJobMap]
>(QueueName.Messages);
