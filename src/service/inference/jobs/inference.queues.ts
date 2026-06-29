import { queueManager } from "@/lib/bullmq";
import { ServiceQueueName } from "@/lib/bullmq/bullmq.config";
import { InferenceJobMap } from "../inference.types";

export const inferenceQueue = queueManager.getQueue<
  InferenceJobMap[keyof InferenceJobMap]
>(ServiceQueueName.Inference);
