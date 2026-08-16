import { Job } from "bullmq";
import { db } from "@/lib/drizzle";
import { documentsTable } from "@/feature/documents/documents.schema";
import { findDocument } from "@/feature/documents/operations/documents.find";
import { updateDocument } from "@/feature/documents/operations/documents.update";
import { documentsQueue } from "@/feature/documents/jobs/documents.queue";
import { DocumentJobs } from "@/feature/documents/document.config";
import { unwrapJobResult } from "@/lib/bullmq/bullmq.utils";
import { logger } from "@/lib/logger";
import { getLawSourceClients } from "../law-source.client";
import { recordLawSourceCheck } from "../law-source.persistence";
import { LawDocumentRef, SourceCheck } from "../law-source.types";
import { LawSourceJobs } from "./law-sources.config";
import { LawSourceJobMap } from "./law-sources.types";

// No authenticated user exists for a scheduled diff check; the re-ingest job
// only uses `userId` for logging.
const SYSTEM_ACTOR = "system";

export class LawSourceJobHandler {
  static async handleDiffCheck(
    data: LawSourceJobMap[typeof LawSourceJobs.DiffCheck],
    job?: Job,
  ) {
    const clients = getLawSourceClients();
    if (clients.length === 0) {
      logger.info(
        "Law source diff check ran but no clients are configured (LAW_SOURCES_ENABLED); nothing to do",
      );
      return { checked: 0, reingested: 0, newActs: 0, failures: 0 };
    }

    const rows = await db
      .select({
        id: documentsTable.id,
        title: documentsTable.title,
        sourceUrl: documentsTable.sourceUrl,
        lastUpdated: documentsTable.lastUpdated,
        version: documentsTable.version,
      })
      .from(documentsTable);

    const documents: LawDocumentRef[] = rows.map((row) => ({
      id: row.id,
      title: row.title,
      sourceUrl: row.sourceUrl,
      lastUpdated: row.lastUpdated,
    }));

    let checked = 0;
    let reingested = 0;
    let newActs = 0;
    let failures = 0;

    for (const client of clients) {
      let checks: SourceCheck[];
      try {
        checks = await client.check(documents);
      } catch (error) {
        failures++;
        logger.error(
          { client: client.name, error },
          "Law source diff check failed",
        );
        continue;
      }

      for (const check of checks) {
        try {
          if (check.action === "reingest" && check.documentId) {
            await this.handleReingest(check);
            reingested++;
          } else if (check.action === "new-act") {
            logger.info(
              { client: client.name, title: check.title },
              "Law source lists an act not tracked in documents",
            );
            newActs++;
          } else if (check.action === "detection-failed") {
            failures++;
          }
          checked++;
          await recordLawSourceCheck(check);
        } catch (error) {
          logger.error(
            { client: client.name, documentId: check.documentId, error },
            "Failed to process law source check",
          );
        }
      }
    }

    logger.info(
      {
        triggeredBy: data.triggeredBy,
        clients: clients.map((client) => client.name),
        checked,
        reingested,
        newActs,
        failures,
      },
      "Law source diff check complete",
    );

    return { checked, reingested, newActs, failures };
  }

  /**
   * U3.2: an amendment was detected — bump the document version + `lastUpdated`
   * first (the ingest worker reads the version off the document row), then
   * enqueue the existing ingestion job, which re-embeds with version-scoped
   * ids and deletes the previous version's chunks (U1.4).
   */
  private static async handleReingest(check: SourceCheck) {
    const result = unwrapJobResult(
      await findDocument("id", check.documentId!),
      {
        message: "Document disappeared before re-ingest",
        shouldRetry: false,
      },
    );
    const current = result.data!;
    const nextVersion = (current.version ?? 1) + 1;
    const detectedLastUpdated = check.detectedLastUpdated;

    if (!detectedLastUpdated) {
      logger.warn(
        { documentId: check.documentId },
        "Re-ingest requested but no detected amendment date; skipping",
      );
      return;
    }

    await updateDocument("id", check.documentId!, {
      version: nextVersion,
      lastUpdated: detectedLastUpdated,
    });

    await documentsQueue.add(DocumentJobs.DocumentUploaded, {
      documentId: check.documentId!,
      userId: SYSTEM_ACTOR,
      filename: current.title,
    });

    logger.info(
      {
        documentId: check.documentId,
        nextVersion,
        lastUpdated: detectedLastUpdated,
      },
      "Enqueued re-ingest for amended document",
    );
  }
}
