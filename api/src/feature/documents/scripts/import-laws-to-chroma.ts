import { chromaClient } from "@/lib/chroma";
import { logger } from "@/lib/logger";
import { laws as lawsDataset } from "@/service/rag-service/dataset/laws.dataset";

const COLLECTION_NAME = "legal_questions";
const BATCH_SIZE = 20;

interface Law {
  id: number | string;
  title: string;
  category: string;
  source: string;
  content: string;
}

async function importLawsToChroma(laws: Law[]) {
  const documents: string[] = [];
  const metadatas: Record<string, unknown>[] = [];
  const ids: string[] = [];

  for (const law of laws) {
    documents.push(`${law.title}. ${law.content}`);
    metadatas.push({
      id: law.id.toString(),
      title: law.title,
      category: law.category,
      source: law.source,
      content_length: law.content.length,
      imported_at: new Date().toISOString(),
    });
    ids.push(`law_${law.id}`);
  }

  logger.info(`Prepared ${documents.length} laws for import`);

  let importedCount = 0;
  for (let i = 0; i < documents.length; i += BATCH_SIZE) {
    const batchDocs = documents.slice(i, i + BATCH_SIZE);
    const batchMetadatas = metadatas.slice(i, i + BATCH_SIZE);
    const batchIds = ids.slice(i, i + BATCH_SIZE);

    await chromaClient.addDocuments({
      collectionName: COLLECTION_NAME,
      documents: batchDocs,
      metadatas: batchMetadatas,
      ids: batchIds,
    });

    importedCount += batchDocs.length;
    logger.info(`Imported ${importedCount}/${documents.length} documents`);
  }

  const collectionCount = await chromaClient.countCollection(COLLECTION_NAME);
  logger.info(
    `Total documents in collection '${COLLECTION_NAME}': ${collectionCount}`,
  );
}

async function main() {
  try {
    await importLawsToChroma(lawsDataset);
    logger.info("Successfully imported all laws to ChromaDB!");
    process.exit(0);
  } catch (error) {
    logger.error({ error }, "Error importing laws to ChromaDB:");
    process.exit(1);
  }
}

main();
