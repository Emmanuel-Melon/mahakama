import { db } from "@/lib/drizzle";
import { documentsTable } from "../corpus.schema";
import { NewCorpus, type Corpus } from "../corpus.types";
import {
  executeSingle,
  type DbResult,
} from "@/lib/drizzle/results/results.single";

export async function createCorpusEntry(
  documentData: NewCorpus,
): Promise<DbResult<Corpus>> {
  return executeSingle(
    db
      .insert(documentsTable)
      .values(documentData)
      .returning()
      .then(([document]) => document),
  );
}
