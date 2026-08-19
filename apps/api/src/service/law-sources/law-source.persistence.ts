import { db } from "@/lib/drizzle";
import { lawSourceChecksTable } from "@/feature/corpus/corpus.schema";
import { SourceCheck } from "./law-source.types";

/** Persist one diff-check row for auditability (metadata-updates.md U3.4). */
export const recordLawSourceCheck = async (check: SourceCheck) => {
  await db.insert(lawSourceChecksTable).values({
    client: check.client,
    documentId: check.documentId,
    title: check.title,
    sourceUrl: check.sourceUrl ?? null,
    detectedLastUpdated: check.detectedLastUpdated,
    previousLastUpdated: check.previousLastUpdated ?? null,
    action: check.action,
    detail: check.detail ?? null,
  });
};
