import { queueManager } from "@/lib/bullmq";
import { QueueName } from "@/lib/bullmq/bullmq.config";
import { LawSourceJobMap } from "./law-sources.types";

export const lawSourcesQueue = queueManager.getQueue<
  LawSourceJobMap[keyof LawSourceJobMap]
>(QueueName.Scheduled);
