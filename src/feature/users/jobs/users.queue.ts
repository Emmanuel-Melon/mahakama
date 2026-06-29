import { queueManager } from "@/lib/bullmq";
import { QueueName } from "@/lib/bullmq/bullmq.config";
import { UserJobMap } from "../users.types";

export const usersQueue = queueManager.getQueue<UserJobMap[keyof UserJobMap]>(
  QueueName.User,
);
