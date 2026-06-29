import { ServiceQueueName } from "@/lib/bullmq/bullmq.config";
import { createBullWorker } from "@/lib/bullmq";
import { InferenceJobs } from "../inference.config";
import { InferenceJobHandler } from "./inference.jobs";
import { JobHandlerMap } from "@/lib/bullmq/bullmq.types";
import { InferenceJobMap } from "../inference.types";

const inferenceHandlers: JobHandlerMap<InferenceJobMap> = {
  [InferenceJobs.TextGeneration]: (data) =>
    InferenceJobHandler.handleTextGeneration(data),
  [InferenceJobs.DocumentAnalysis]: (data) =>
    InferenceJobHandler.handleDocumentAnalysis(data),
  [InferenceJobs.EmbeddingGeneration]: (data) =>
    InferenceJobHandler.handleEmbeddingGeneration(data),
};

export const initInferenceWorker = () =>
  createBullWorker<InferenceJobMap>(
    ServiceQueueName.Inference,
    inferenceHandlers,
  );
