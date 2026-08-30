import { QueueName } from "@/lib/bullmq/bullmq.config";
import { createBullWorker } from "@/lib/bullmq";
import { MattersJobs } from "../matter.config";
import { MattersJobHandler } from "./matter.jobs";
import { JobHandlerMap } from "@/lib/bullmq/bullmq.types";
import { MatterJobMap } from "../matter.types";

const matterHandlers: JobHandlerMap<MatterJobMap> = {
  [MattersJobs.MatterFromChat]: (data) =>
    MattersJobHandler.handleMatterFromChat(data),
  [MattersJobs.GenerateMatterSummary]: (data) =>
    MattersJobHandler.handleGenerateMatterSummary(data),
  [MattersJobs.MatterStatusChanged]: (data) =>
    MattersJobHandler.handleMatterStatusChanged(data),
  [MattersJobs.LawyerInvitedToMatter]: (data) =>
    MattersJobHandler.handleLawyerInvitedToMatter(data),
  [MattersJobs.ProcessMatterDocument]: (data) =>
    MattersJobHandler.handleProcessMatterDocument(data),
  [MattersJobs.ProcessMatterDocumentAnalysis]: (data) =>
    MattersJobHandler.handleAnalyzeMatterDocument(data),
};

export const initMatterWorker = () =>
  createBullWorker<MatterJobMap>(QueueName.Matter, matterHandlers);
