import { Request, Response } from "express";
import { downloadCorpusEntry } from "../operations/corpus.download";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { findCorpusEntry } from "../operations/corpus.find";
import { HttpStatus } from "@/lib/http/http.status";
import { CorpusSerializer } from "../corpus.config";
import { asyncHandler } from "@/lib/express/express.async-handler";
import { unwrap } from "@/lib/drizzle/drizzle.utils";
import { HttpError } from "@/lib/http/http.error";

export const downloadCorpusController = asyncHandler(
  async (req: Request, res: Response) => {
    const corpusId = req.params.documentId as string;
    const userId = req.user?.id;

    unwrap(
      await downloadCorpusEntry({
        documentId: corpusId,
        user_id: userId!,
      }),
      new HttpError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "Failed to download corpus entry",
      ),
    );

    const entry = unwrap(
      await findCorpusEntry("id", corpusId),
      new HttpError(HttpStatus.NOT_FOUND, "Corpus entry not found"),
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
        status: HttpStatus.SUCCESS,
      },
    );
  },
);
