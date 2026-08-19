import { queueManager } from "@/lib/bullmq";
import { QueueName } from "@/lib/bullmq/bullmq.config";
import { EmbeddingsJobMap } from "../embeddings.types";

export const embeddingsQueue = queueManager.getQueue<
  EmbeddingsJobMap[keyof EmbeddingsJobMap]
>(QueueName.Embeddings);
