import { Queue, Worker, ConnectionOptions, Job } from "bullmq";
import { defaultWorkerOptions, QueueName } from "./bullmq.config";
import { getRedisConnection } from "@/lib/redis";
import { defaultBullJobOptions } from "./bullmq.config";
import { logger } from "../logger";
import { JobHandlerMap } from "./bullmq.types";
import { processBullJob } from "./bullmq.utils";

export class QueueManager {
  private static instance: QueueManager;
  private queues: Map<string, Queue> = new Map();

  private constructor() {}

  public static getInstance(): QueueManager {
    if (!QueueManager.instance) QueueManager.instance = new QueueManager();
    return QueueManager.instance;
  }

  public getQueue<T = any>(name: QueueName): Queue<T> {
    if (!this.queues.has(name)) {
      const queue = new Queue(name, {
        connection: getRedisConnection() as ConnectionOptions,
        defaultJobOptions: defaultBullJobOptions,
      });
      this.queues.set(name, queue);
    }
    return this.queues.get(name) as Queue<T>;
  }

  public async closeAll() {
    // Note: We don't close the redisConnection here because
    // it might be shared with other parts of the app.
    // We just close the queues.
    await Promise.all(Array.from(this.queues.values()).map((q) => q.close()));
    this.queues.clear();
  }
}

export const createBullWorker = <TMap>(
  queueName: string,
  handlers: JobHandlerMap<TMap>,
  options?: Partial<WorkerOptions>,
) => {
  const worker = new Worker(
    queueName,
    async (job: Job) => {
      const handler = handlers[job.name as keyof TMap];

      if (!handler) {
        logger.warn(
          { jobName: job.name, queueName },
          "No handler found for job",
        );
        return;
      }

      return await processBullJob(`${queueName}:${job.name}`, job, () =>
        handler(job.data as TMap[keyof TMap], job),
      );
    },
    {
      connection: getRedisConnection() as ConnectionOptions,
      ...defaultWorkerOptions,
      ...options,
    },
  );

  registerWorker(worker);
  return worker;
};

export const queueManager = QueueManager.getInstance();

export const workers: Worker[] = [];

export const registerWorker = (worker: Worker) => workers.push(worker);
export const getActiveWorkers = () => workers;
