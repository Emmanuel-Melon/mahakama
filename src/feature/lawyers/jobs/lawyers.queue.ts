import { queueManager } from "@/lib/bullmq";
import { QueueName } from "@/lib/bullmq/bullmq.config";
import { LawyersJobMap } from "../lawyers.types";

export const lawyersQueue = queueManager.getQueue<
  LawyersJobMap[keyof LawyersJobMap]
>(QueueName.Lawyers);
