import { queueManager } from "@/lib/bullmq";
import { QueueName } from "@/lib/bullmq/bullmq.config";

export const userDocumentsQueue = queueManager.getQueue(QueueName.Scheduled);
