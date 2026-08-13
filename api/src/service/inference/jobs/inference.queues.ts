import { queueManager } from "@/lib/bullmq";
import { QueueName } from "@/lib/bullmq/bullmq.config";
import { InferenceJobMap } from "../inference.types";

export const inferenceQueue = queueManager.getQueue<
  InferenceJobMap[keyof InferenceJobMap]
>(QueueName.Inference);
