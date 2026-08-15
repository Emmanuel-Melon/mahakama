import { QueueName } from "@/lib/bullmq/bullmq.config";
import { createBullWorker } from "@/lib/bullmq";
import { JobHandlerMap } from "@/lib/bullmq/bullmq.types";
import { LawSourceJobs } from "./law-sources.config";
import { LawSourceJobMap } from "./law-sources.types";
import { LawSourceJobHandler } from "./law-sources.jobs";

const lawSourceHandlers: JobHandlerMap<LawSourceJobMap> = {
  [LawSourceJobs.DiffCheck]: (data, job) =>
    LawSourceJobHandler.handleDiffCheck(data, job),
};

export const initLawSourcesWorker = () => {
  return createBullWorker<LawSourceJobMap>(
    QueueName.Scheduled,
    lawSourceHandlers,
  );
};
