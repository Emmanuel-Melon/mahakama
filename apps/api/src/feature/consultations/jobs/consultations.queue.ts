import { queueManager } from "@/lib/bullmq";
import { QueueName } from "@/lib/bullmq/bullmq.config";
import { ConsultationsJobMap } from "../consultations.types";

export const consultationsQueue = queueManager.getQueue<
  ConsultationsJobMap[keyof ConsultationsJobMap]
>(QueueName.Consultations);
