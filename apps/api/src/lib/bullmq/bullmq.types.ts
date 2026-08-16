import { WorkerOptions, QueueOptions, JobsOptions, Queue, Job } from "bullmq";
import Redis from "ioredis";

export type QueueInstance = {
  queue: Queue;
  enqueue: <T>(
    data: T,
    options?: JobOptions,
  ) => Promise<import("bullmq").Job<T>>;
  getHealth: () => Promise<QueueHealth>;
};

export type ConnectionOptions = {
  host: string;
  port: number;
  password: string;
  tls: object;
};

export type QueueConfig = {
  connection: ConnectionOptions | Redis;
};

export type BullWorkerOptions = QueueConfig & {
  concurrency: number;
  removeOnComplete: { count: number };
  removeOnFail: { count: number };
};

export interface QueueHealth {
  waiting: number;
  active: number;
  completed: number;
  failed: number;
  delayed: number;
  paused: number;
  isHealthy: boolean;
  lastChecked: Date;
  error?: string;
}

export interface QueueStatus extends QueueHealth {
  name: string;
  isPaused: boolean;
  workerCount: number;
}

export interface JobOptions extends Omit<Partial<JobsOptions>, "backoff"> {
  backoff?: {
    type: "fixed" | "exponential";
    delay: number;
  };
  attempts?: number;
  removeOnComplete?: boolean | number;
  removeOnFail?: boolean | number;
}

export interface JobMetadata {
  source: string;
  requestId?: string;
  userAgent?: string | string[] | undefined;
  ip?: string;
}

export interface BaseJobPayload<T> {
  eventId: string;
  timestamp: string;
  actor: string;
  payload: T;
  metadata: JobMetadata;
}

export interface EnqueueOptions extends JobsOptions {
  // BullMQ natively supports delay, priority, and attempts
}

export type JobHandler<T> = (data: T) => Promise<void>;

export type JobHandlerMap<TJobMap> = {
  [K in keyof TJobMap]: (data: TJobMap[K], job: Job) => Promise<any>;
};
