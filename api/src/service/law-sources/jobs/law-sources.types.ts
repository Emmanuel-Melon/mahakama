import { LawSourceJobs } from "./law-sources.config";

export interface LawSourceJobMap {
  [LawSourceJobs.DiffCheck]: {
    triggeredBy?: string; // "scheduler" (cron) or a manual run
  };
}
