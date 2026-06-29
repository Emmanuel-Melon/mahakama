import { queueManager } from "@/lib/bullmq";
import { QueueName } from "@/lib/bullmq/bullmq.config";
import { AuthJobMap } from "../auth.types";

export const authQueue = queueManager.getQueue<AuthJobMap[keyof AuthJobMap]>(
  QueueName.Auth,
);
