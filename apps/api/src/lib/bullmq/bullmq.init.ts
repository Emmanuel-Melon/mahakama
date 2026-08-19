import { logger } from "../logger";
import { initAuthWorker } from "@/feature/auth/jobs/auth.worker";
import { initChatsWorker } from "@/feature/chats/jobs/chats.worker";
import { initCorpusWorker } from "@/feature/corpus/jobs/corpus.worker";
import { initLawyersWorker } from "@/feature/lawyers/jobs/lawyers.worker";
import { initMessagesWorker } from "@/feature/messages/jobs/messages.worker";
import { initLawSourcesWorker } from "@/service/law-sources/jobs/law-sources.worker";
import { registerLawSourceScheduler } from "@/service/law-sources/jobs/law-sources.scheduler";
import { initShadowReplayWorker } from "@/service/embedding-service/jobs/embeddings.worker";
import { registerShadowReplayScheduler } from "@/service/embedding-service/jobs/embeddings.scheduler";

export const initAllWorkers = () => {
  logger.info("Initializing background workers...");
  // initAuthWorker();
  initCorpusWorker();
  initChatsWorker();
  initLawSourcesWorker();
  initShadowReplayWorker();
  // initLawyersWorker();
  // initMessagesWorker();
  registerLawSourceScheduler().catch((error) => {
    logger.error({ error }, "Failed to register law source scheduler");
  });
  registerShadowReplayScheduler().catch((error) => {
    logger.error({ error }, "Failed to register shadow replay scheduler");
  });
};
