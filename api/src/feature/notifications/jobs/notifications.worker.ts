import { QueueName } from "@/lib/bullmq/bullmq.config";
import { createBullWorker } from "@/lib/bullmq";
import { NotificationJobs } from "../notifications.config";
import { NotificationsJobHandler } from "./notifications.jobs";
import { JobHandlerMap } from "@/lib/bullmq/bullmq.types";
import { NotificationJobMap } from "../notifications.types";

// Email notification handlers
const emailHandlers: JobHandlerMap<
  Pick<NotificationJobMap, typeof NotificationJobs.SendEmailNotification>
> = {
  [NotificationJobs.SendEmailNotification]: (data) =>
    NotificationsJobHandler.handleSendEmailNotification(data),
};

// In-app notification handlers
const inAppHandlers: JobHandlerMap<
  Pick<NotificationJobMap, typeof NotificationJobs.SendInAppNotification>
> = {
  [NotificationJobs.SendInAppNotification]: (data) =>
    NotificationsJobHandler.handleSendInAppNotification(data),
};

// Main notifications handlers
const notificationsHandlers: JobHandlerMap<NotificationJobMap> = {
  [NotificationJobs.SetPreferences]: (data) =>
    NotificationsJobHandler.handleSetPreferences(data),
  [NotificationJobs.SendEmailNotification]: (data) =>
    NotificationsJobHandler.handleSendEmailNotification(data),
  [NotificationJobs.SendInAppNotification]: (data) =>
    NotificationsJobHandler.handleSendInAppNotification(data),
  [NotificationJobs.SendPushNotification]: (data) =>
    NotificationsJobHandler.handleSendPushNotification(data),
  [NotificationJobs.TriggerNotification]: (data) =>
    NotificationsJobHandler.handleTriggerNotification(data),
};

// Push notification handlers
const pushHandlers: JobHandlerMap<
  Pick<NotificationJobMap, typeof NotificationJobs.SendPushNotification>
> = {
  [NotificationJobs.SendPushNotification]: (data) =>
    NotificationsJobHandler.handleSendPushNotification(data),
};

// Main notifications worker
export const initNotificationsWorker = () =>
  createBullWorker<NotificationJobMap>(
    QueueName.Notifications,
    notificationsHandlers,
  );

// Email notification worker
export const initEmailWorker = () =>
  createBullWorker<
    Pick<NotificationJobMap, typeof NotificationJobs.SendEmailNotification>
  >(QueueName.Email, emailHandlers);

// In-app notification worker
export const initInAppWorker = () =>
  createBullWorker<
    Pick<NotificationJobMap, typeof NotificationJobs.SendInAppNotification>
  >(QueueName.InApp, inAppHandlers);

// Push notification worker
export const initPushWorker = () =>
  createBullWorker<
    Pick<NotificationJobMap, typeof NotificationJobs.SendPushNotification>
  >(QueueName.Push, pushHandlers);
