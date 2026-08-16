import { queueManager } from "@/lib/bullmq";
import { QueueName } from "@/lib/bullmq/bullmq.config";
import {
  NotificationJobMap,
  NotificationChannelRouter,
} from "../notifications.types";
import { NotificationChannel, NotificationJobs } from "../notifications.config";

// Main notifications queue for processing incoming notification requests
export const notificationsQueue = queueManager.getQueue<
  NotificationJobMap[(typeof NotificationJobs)[keyof typeof NotificationJobs]]
>(QueueName.Notifications);

export const emailQueue = queueManager.getQueue<
  NotificationJobMap[typeof NotificationJobs.SendEmailNotification]
>(QueueName.Email);

export const pushQueue = queueManager.getQueue<
  NotificationJobMap[typeof NotificationJobs.SendPushNotification]
>(QueueName.Push);

export const inAppQueue = queueManager.getQueue<
  NotificationJobMap[typeof NotificationJobs.SendInAppNotification]
>(QueueName.InApp);

export const channelQueueMap: Record<
  NotificationChannel,
  NotificationChannelRouter
> = {
  [NotificationChannel.Email]: (data) =>
    emailQueue.add(NotificationJobs.SendEmailNotification, data),

  [NotificationChannel.InApp]: (data) =>
    inAppQueue.add(NotificationJobs.SendInAppNotification, data),

  [NotificationChannel.Push]: (data) =>
    pushQueue.add(NotificationJobs.SendPushNotification, data),
};
