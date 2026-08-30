import { queueManager } from "@/lib/bullmq";
import { QueueName } from "@/lib/bullmq/bullmq.config";
import { MatterJobMap } from "../matter.types";

export const matterQueue = queueManager.getQueue<
  MatterJobMap[keyof MatterJobMap]
>(QueueName.Matter);
