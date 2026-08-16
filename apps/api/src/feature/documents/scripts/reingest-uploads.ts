import fs from "fs";
import path from "path";
import { eq } from "drizzle-orm";
import { serverConfig, storageConfig } from "@/config";
import { db } from "@/lib/drizzle";
import { logger } from "@/lib/logger";
import { documentsTable } from "../documents.schema";
import { createDocument } from "../operations/documents.create";
import { updateDocument } from "../operations/documents.update";
import { markEmbeddingJobFailed } from "@/service/embedding-service/embeddings.persistence";
import { processDocumentPipeline } from "../operations/documents.ingest";

const today = () => new Date().toISOString().slice(0, 10);

const listPdfs = (): string[] => {
  if (!fs.existsSync(storageConfig.dir)) {
    return [];
  }
  return fs
    .readdirSync(storageConfig.dir)
    .filter((name) => name.toLowerCase().endsWith(".pdf"))
    .sort();
};

async function reingestUploads() {
  const files = listPdfs();
  if (files.length === 0) {
    logger.info(`No PDFs found in '${storageConfig.dir}'; nothing to do`);
    return;
  }

  logger.info(
    `Found ${files.length} PDF(s) in '${storageConfig.dir}', re-ingesting...`,
  );

  for (const file of files) {
    const storageUrl = `${serverConfig.baseUrl}/uploads/${file}`;
    let documentId: string | undefined;

    try {
      const [existing] = await db
        .select({ id: documentsTable.id, version: documentsTable.version })
        .from(documentsTable)
        .where(eq(documentsTable.storageUrl, storageUrl))
        .limit(1);

      if (existing) {
        const nextVersion = (existing.version ?? 1) + 1;
        await updateDocument("id", existing.id, {
          version: nextVersion,
          lastUpdated: today(),
        });
        documentId = existing.id;
        logger.info(
          { filename: file, documentId, nextVersion },
          "Bumping version for existing document",
        );
      } else {
        const created = await createDocument({
          title: path.basename(file, path.extname(file)),
          description: "",
          type: "law",
          sections: 1,
          lastUpdated: today(),
          storageUrl,
        });
        if (!created.ok || !created.data) {
          throw new Error("Failed to create document row");
        }
        documentId = created.data.id;
        logger.info(
          { filename: file, documentId },
          "Created document row for uploaded file",
        );
      }

      const result = await processDocumentPipeline(documentId, {
        onBatchProgress: ({
          batchIndex,
          totalBatches,
          processedChunks,
          totalChunks,
        }) => {
          logger.info(
            { documentId, batchIndex, totalBatches },
            `Batch ${batchIndex}/${totalBatches}: ${processedChunks}/${totalChunks} chunks`,
          );
        },
      });

      if (result.totalChunks === 0) {
        logger.warn(
          { filename: file, documentId },
          "File yielded no extractable text; embedding job marked failed",
        );
        continue;
      }

      logger.info(
        {
          filename: file,
          documentId,
          version: result.chunkVersion,
          totalChunks: result.totalChunks,
        },
        "Re-ingested file",
      );
    } catch (error) {
      logger.error(
        { filename: file, documentId, error },
        "Failed to re-ingest file",
      );
      if (documentId) {
        markEmbeddingJobFailed(documentId, error);
      }
    }
  }
}

async function main() {
  try {
    await reingestUploads();
    logger.info("Finished re-ingesting uploads");
    process.exit(0);
  } catch (error) {
    logger.error({ error }, "Error re-ingesting uploads");
    process.exit(1);
  }
}

main();
