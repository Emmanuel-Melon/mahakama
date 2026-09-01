import { QueueName } from "@/lib/bullmq/bullmq.config";
import { createBullWorker } from "@/lib/bullmq";
import { InferenceJobs } from "../inference.config";
import { InferenceJobHandler } from "./inference.jobs";
import { JobHandlerMap } from "@/lib/bullmq/bullmq.types";
import { InferenceJobMap } from "../inference.types";

const inferenceHandlers: JobHandlerMap<InferenceJobMap> = {
  [InferenceJobs.TextGeneration]: (data) =>
    InferenceJobHandler.handleTextGeneration(data),
};

export const initInferenceWorker = () =>
  createBullWorker<InferenceJobMap>(QueueName.Inference, inferenceHandlers);
