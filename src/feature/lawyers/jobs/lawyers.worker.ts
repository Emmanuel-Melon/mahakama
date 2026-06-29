import { QueueName } from "@/lib/bullmq/bullmq.config";
import { createBullWorker } from "@/lib/bullmq";
import { LawyerJobs } from "../lawyers.config";
import { LawyersJobHandler } from "./lawyers.jobs";
import { JobHandlerMap } from "@/lib/bullmq/bullmq.types";
import { LawyersJobMap } from "../lawyers.types";

const lawyersHandlers: JobHandlerMap<LawyersJobMap> = {
  [LawyerJobs.LawyerOnboarded]: (data) =>
    LawyersJobHandler.handleLawyerOnboarded(data),
  [LawyerJobs.LawyerVerified]: (data) =>
    LawyersJobHandler.handleLawyerVerified(data),
};

export const initLawyersWorker = () =>
  createBullWorker<LawyersJobMap>(QueueName.User, lawyersHandlers);
