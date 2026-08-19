import { Request, Response } from "express";
import { createCorpusEntry } from "../operations/corpus.insert";
import { NewCorpus } from "../corpus.types";
import { HttpStatus } from "@/lib/http/http.status";
import { corpusQueue } from "../jobs/corpus.queue";
import { CorpusSerializer } from "../corpus.config";
import { asyncHandler } from "@/lib/express/express.async-handler";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { unwrap } from "@/lib/drizzle/drizzle.utils";
import { HttpError } from "@/lib/http/http.error";
import { CorpusJobs } from "../corpus.config";
import { logger } from "@/lib/logger";
import { formatStorageUrl, getDocumentFileSize } from "@/utils/url";

export const createCorpusHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const corpusData: NewCorpus = req.body;
    const storageUrl = formatStorageUrl(corpusData.storageUrl);
    const entry = unwrap(
      await createCorpusEntry({
        ...corpusData,
        storageUrl,
      }),
      new HttpError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "Failed to create corpus entry",
      ),
    );

    sendSuccessResponse(
      req,
      res,
      {
        data: { ...entry, id: entry.id.toString() } as typeof entry & {
          id: string;
        },
        type: "single",
        serializerConfig: CorpusSerializer,
      },
      {
        status: HttpStatus.CREATED,
      },
    );

    let enqueued = false;
    try {
      const size = getDocumentFileSize(storageUrl);

      await corpusQueue.add(CorpusJobs.CorpusUploaded, {
        documentId: entry.id,
        userId: req.user?.id!,
        filename: entry.title,
        size,
      });
      enqueued = true;
    } catch (error) {
      logger.error(
        { documentId: entry.id, error },
        "Failed to enqueue corpus upload job",
      );
    }
    logger.info(
      { documentId: entry.id, enqueued, storageUrl },
      "Corpus entry created",
    );
  },
);
