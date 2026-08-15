import { logger } from "../logger";
import { initAuthWorker } from "@/service/auth/jobs/auth.worker";
import { initChatsWorker } from "@/feature/chats/jobs/chats.worker";
import { initDocumentsWorker } from "@/feature/documents/jobs/documents.worker";
import { initLawyersWorker } from "@/feature/lawyers/jobs/lawyers.worker";
import { initMessagesWorker } from "@/feature/messages/jobs/messages.worker";
import { initLawSourcesWorker } from "@/service/law-sources/jobs/law-sources.worker";
import { registerLawSourceScheduler } from "@/service/law-sources/jobs/law-sources.scheduler";

export const initAllWorkers = () => {
  logger.info("👷 Initializing background workers...");
  // initAuthWorker();
  initDocumentsWorker();
  initChatsWorker();
  initLawSourcesWorker();
  // initLawyersWorker();
  // initMessagesWorker();
  registerLawSourceScheduler().catch((error) => {
    logger.error({ error }, "Failed to register law source scheduler");
  });
};
