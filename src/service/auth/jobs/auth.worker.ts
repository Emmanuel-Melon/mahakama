import { QueueName } from "@/lib/bullmq/bullmq.config";
import { AuthJobs } from "../auth.config";
import { createBullWorker } from "@/lib/bullmq";
import { AuthJobHandler } from "./auth.jobs";
import { JobHandlerMap } from "@/lib/bullmq/bullmq.types";
import { AuthJobMap } from "../auth.types";

const authHandlers: JobHandlerMap<AuthJobMap> = {
  [AuthJobs.Login]: (data) => AuthJobHandler.handleLogin(data),
  [AuthJobs.Registration]: (data) => AuthJobHandler.handleRegistration(data),
};

export const initAuthWorker = () =>
  createBullWorker<AuthJobMap>(QueueName.Auth, authHandlers);
