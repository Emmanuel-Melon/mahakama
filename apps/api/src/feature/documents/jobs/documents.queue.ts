import { queueManager } from "@/lib/bullmq";
import { QueueName } from "@/lib/bullmq/bullmq.config";

export const documentsQueue = queueManager.getQueue(QueueName.Scheduled);
