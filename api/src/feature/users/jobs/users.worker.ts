import { QueueName } from "@/lib/bullmq/bullmq.config";
import { createBullWorker } from "@/lib/bullmq";
import { UserJobs } from "../users.config";
import { UsersJobHandler } from "./users.jobs";
import { JobHandlerMap } from "@/lib/bullmq/bullmq.types";
import { UserJobMap } from "../users.types";

const usersHandlers: JobHandlerMap<UserJobMap> = {
  [UserJobs.UserCreated]: (data) => UsersJobHandler.handleUserCreated(data),
  [UserJobs.UserUpdated]: (data) => UsersJobHandler.handleUserUpdated(data),
  [UserJobs.UserDeleted]: (data) => UsersJobHandler.handleUserDeleted(data),
  [UserJobs.UserOnboarded]: (data) => UsersJobHandler.handleUserOnboarded(data),
  [UserJobs.UserVerified]: (data) => UsersJobHandler.handleUserVerified(data),
};

export const initUsersWorker = () =>
  createBullWorker<UserJobMap>(QueueName.User, usersHandlers);
