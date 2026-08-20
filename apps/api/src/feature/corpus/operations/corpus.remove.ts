import { db } from "@/lib/drizzle";
import { documentsTable } from "../corpus.schema";
import type { Corpus, CorpusColumn, CorpusColumnKey } from "../corpus.types";
import { eq } from "drizzle-orm";
import {
  executeSingle,
  type DbResult,
} from "@/lib/drizzle/results/results.single";

export const removeCorpusEntry = async <K extends CorpusColumnKey>(
  field: K,
  value: CorpusColumn[K]["_"]["data"],
): Promise<DbResult<Corpus>> => {
  return executeSingle(
    db
      .delete(documentsTable)
      .where(eq(documentsTable[field], value))
      .returning()
      .then(([result]) => result),
  );
};
