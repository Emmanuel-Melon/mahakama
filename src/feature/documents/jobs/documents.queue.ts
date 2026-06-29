import { queueManager } from "@/lib/bullmq";
import { QueueName } from "@/lib/bullmq/bullmq.config";
import { DocumentJobMap } from "../documents.types";

export const documentsQueue = queueManager.getQueue<
  DocumentJobMap[keyof DocumentJobMap]
>(QueueName.Documents);
