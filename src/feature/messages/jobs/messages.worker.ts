import { QueueName } from "@/lib/bullmq/bullmq.config";
import { createBullWorker } from "@/lib/bullmq";
import { MessageJobs } from "../messages.config";
import { MessagesJobHandler } from "./messages.jobs";
import { JobHandlerMap } from "@/lib/bullmq/bullmq.types";
import { MessageJobMap } from "../messages.types";

const messagesHandlers: JobHandlerMap<MessageJobMap> = {
  [MessageJobs.MessageSent]: (data) =>
    MessagesJobHandler.handleMessageSent(data),
};

export const initMessagesWorker = () =>
  createBullWorker<MessageJobMap>(QueueName.Documents, messagesHandlers);
