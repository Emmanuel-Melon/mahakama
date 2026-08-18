import { chromaClient } from "@/lib/chroma";
import { logger } from "@/lib/logger";
import {
  laws as lawsDataset,
  toLawDocument,
} from "@/service/rag-service/dataset/laws.dataset";
import { generateDocumentEmbeddings } from "@/service/embedding-service/operations/embeddings.insert";
const COLLECTION_NAME = "legal_questions";

async function importLawsToChroma() {
  const chunks = lawsDataset.map(toLawDocument);

  logger.info(`Prepared ${chunks.length} laws for import`);

  await generateDocumentEmbeddings(chunks, { collectionName: COLLECTION_NAME });

  const collectionCount = await chromaClient.countCollection(COLLECTION_NAME);
  logger.info(
    `Total documents in collection '${COLLECTION_NAME}': ${collectionCount}`,
  );
}

async function main() {
  try {
    await importLawsToChroma();
    logger.info("Successfully imported all laws to ChromaDB!");
    process.exit(0);
  } catch (error) {
    logger.error({ error }, "Error importing laws to ChromaDB:");
    process.exit(1);
  }
}

main();
