import { QueueName } from "@/lib/bullmq/bullmq.config";
import { createBullWorker } from "@/lib/bullmq";
import { JobHandlerMap } from "@/lib/bullmq/bullmq.types";
import { EmbeddingsJobHandler } from "./embeddings.jobs";
import { EmbeddingsJobMap } from "../embeddings.types";
import { EmbeddingsJobs } from "../embeddings.config";

const shadowReplayHandlers: JobHandlerMap<EmbeddingsJobMap> = {
  [EmbeddingsJobs.Replay]: (data, job) =>
    EmbeddingsJobHandler.handleReplay(data, job),
};

export const initShadowReplayWorker = () => {
  return createBullWorker<EmbeddingsJobMap>(
    QueueName.ShadowReplay,
    shadowReplayHandlers,
  );
};
