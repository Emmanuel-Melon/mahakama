import { db } from "@/lib/drizzle";
import { documentsTable } from "../corpus.schema";
import type {
  Corpus,
  CorpusColumn,
  CorpusColumnKey,
  UpdateCorpus,
} from "../corpus.types";
import { eq } from "drizzle-orm";
import {
  executeSingle,
  type DbResult,
} from "@/lib/drizzle/results/results.single";

export const updateCorpusEntry = async <K extends CorpusColumnKey>(
  field: K,
  value: CorpusColumn[K]["_"]["data"],
  updateData: UpdateCorpus,
): Promise<DbResult<Corpus>> => {
  return executeSingle(
    db
      .update(documentsTable)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(documentsTable[field], value))
      .returning()
      .then(([result]) => result),
  );
};
