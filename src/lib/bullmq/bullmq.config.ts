import { JobOptions, BullWorkerOptions } from "./bullmq.types";

export enum QueueName {
  Auth = "auth",
  Questions = "questions",
  Embeddings = "embeddings",
  Answers = "answers",
  Chat = "chat",
  User = "user",
  Documents = "documents",
  Lawyers = "lawyers",
  Notifications = "notifications",
  Messages = "messages",
}

export const WorkerEvents = {
  JOB_STARTED: "[Worker] Job started",
  JOB_COMPLETED: "[Worker] Job completed",
  JOB_FAILED: "[Worker] Job failed",
  JOB_STALLED: "[Worker] Job stalled",
} as const;

export const defaultWorkerOptions: Omit<BullWorkerOptions, "connection"> = {
  concurrency: 5, // Process 5 jobs in parallel
  removeOnComplete: { count: 100 }, // Keep last 100 completed jobs
  removeOnFail: { count: 200 }, // Keep last 200 failed jobs
};

export const defaultBullJobOptions: JobOptions = {
  attempts: 3, // Retry failed jobs up to 3 times
  backoff: {
    type: "exponential",
    delay: 2000, // Start with 2 seconds delay
  },
  removeOnComplete: true, // Remove completed jobs
  removeOnFail: false, // Do not remove failed jobs
};
