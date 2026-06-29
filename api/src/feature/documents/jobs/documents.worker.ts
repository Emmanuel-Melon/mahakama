import { QueueName } from "@/lib/bullmq/bullmq.config";
import { createBullWorker } from "@/lib/bullmq";
import { DocumentJobs } from "../document.config";
import { DocumentsJobHandler } from "./documents.jobs";
import { JobHandlerMap } from "@/lib/bullmq/bullmq.types";
import { DocumentJobMap } from "../documents.types";

const documentsHandlers: JobHandlerMap<DocumentJobMap> = {
  [DocumentJobs.DocumentUploaded]: (data) =>
    DocumentsJobHandler.handleDocumentUploaded(data),
};

export const initDocumentsWorker = () =>
  createBullWorker<DocumentJobMap>(QueueName.Documents, documentsHandlers);
