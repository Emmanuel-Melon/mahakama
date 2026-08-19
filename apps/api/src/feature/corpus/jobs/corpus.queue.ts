import { queueManager } from "@/lib/bullmq";
import { QueueName } from "@/lib/bullmq/bullmq.config";
import { CorpusJobMap } from "../corpus.types";

export const corpusQueue = queueManager.getQueue<
  CorpusJobMap[keyof CorpusJobMap]
>(QueueName.Corpus);
