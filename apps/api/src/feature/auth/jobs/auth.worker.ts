import { QueueName } from "@/lib/bullmq/bullmq.config";
import { AuthJobs } from "../auth.config";
import { createBullWorker } from "@/lib/bullmq";
import { AuthJobHandler } from "./auth.jobs";
import { JobHandlerMap } from "@/lib/bullmq/bullmq.types";
import { AuthJobMap } from "../auth.types";

const authHandlers: JobHandlerMap<AuthJobMap> = {
  [AuthJobs.RegistrationCompleted]: async (payload) =>
    AuthJobHandler.handleRegistration(payload),
  [AuthJobs.LoggedIn]: async (payload) => AuthJobHandler.handleLogin(payload),
  [AuthJobs.RefreshToken]: async (payload) =>
    AuthJobHandler.handleTokenRefresh(payload),
  [AuthJobs.LoggedOut]: async (payload) => AuthJobHandler.handleLogout(payload),
  [AuthJobs.ResetPasswordRequest]: async (payload) =>
    AuthJobHandler.handleResetPasswordRequest(payload),
  [AuthJobs.EmailVerified]: async (payload) =>
    AuthJobHandler.handleEmailVerified(payload),
  [AuthJobs.GenerateVerificationLink]: async (payload) =>
    AuthJobHandler.generateVerificationLinkEvent(payload),
};

export const initAuthWorker = () =>
  createBullWorker<AuthJobMap>(QueueName.Auth, authHandlers);
