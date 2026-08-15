import { lawSourcesConfig } from "@/config";
import { logger } from "@/lib/logger";
import { lawSourcesQueue } from "./law-sources.queue";
import { LawSourceJobs } from "./law-sources.config";

/**
 * Register the monthly diff-check job (metadata-updates.md U3.2). No-op —
 * nothing scheduled — unless `LAW_SOURCES_ENABLED=true` (U3.3). The job is
 * idempotent: `upsertJobScheduler` is safe to call on every boot.
 */
export const registerLawSourceScheduler = async () => {
  if (!lawSourcesConfig.enabled) {
    logger.info("Law source diff check disabled — set LAW_SOURCES_ENABLED=true");
    return;
  }

  await lawSourcesQueue.upsertJobScheduler(
    LawSourceJobs.DiffCheck,
    { pattern: lawSourcesConfig.checkCron },
    {
      name: LawSourceJobs.DiffCheck,
      data: { triggeredBy: "scheduler" },
    },
  );

  logger.info(
    { cron: lawSourcesConfig.checkCron },
    "Law source diff check scheduled",
  );
};
