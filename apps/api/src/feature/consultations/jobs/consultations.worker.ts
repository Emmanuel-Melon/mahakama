import { QueueName } from "@/lib/bullmq/bullmq.config";
import { createBullWorker } from "@/lib/bullmq";
import { ConsultationJobs } from "../consultations.config";
import { ConsultationsJobHandler } from "./consultations.jobs";
import { JobHandlerMap } from "@/lib/bullmq/bullmq.types";
import { ConsultationsJobMap } from "../consultations.types";

const consultationsHandlers: JobHandlerMap<ConsultationsJobMap> = {
  [ConsultationJobs.ConsultationRequested]: (data) =>
    ConsultationsJobHandler.handleConsultationRequested(data),
  [ConsultationJobs.ConsultationAccepted]: (data) =>
    ConsultationsJobHandler.handleConsultationAccepted(data),
  [ConsultationJobs.ConsultationDeclined]: (data) =>
    ConsultationsJobHandler.handleConsultationDeclined(data),
  [ConsultationJobs.ConsultationEngaged]: (data) =>
    ConsultationsJobHandler.handleConsultationEngaged(data),
};

export const initConsultationsWorker = () =>
  createBullWorker<ConsultationsJobMap>(
    QueueName.Consultations,
    consultationsHandlers,
  );
