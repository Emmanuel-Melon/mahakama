import { chromaClient } from "@/lib/chroma";
import { logger } from "@/lib/logger";
import { LegalDocumentChunk } from "../documents.types";

const COLLECTION_NAME = "legal_questions";

async function importLawsToChroma(laws: LegalDocumentChunk[]) {
  try {
    // Prepare documents and metadata
    const documents: string[] = [];
    const metadatas: any[] = [];
    const ids: string[] = [];

    // Process each law
    for (const law of laws) {
      // Create a meaningful document string that includes both title and content
      const document = `${law.title}. ${law.content}`;

      // Create metadata object
      const metadata = {
        id: law.id.toString(),
        title: law.title,
        category: law.category,
        source: law.source,
        content_length: law.content.length,
        imported_at: new Date().toISOString(),
      };

      documents.push(document);
      metadatas.push(metadata);
      ids.push(`law_${law.id}`);
    }

    logger.info(`Prepared ${documents.length} laws for import`);

    // Add documents to ChromaDB in batches to avoid timeouts
    const BATCH_SIZE = 20;
    let importedCount = 0;

    for (let i = 0; i < documents.length; i += BATCH_SIZE) {
      const batchDocs = documents.slice(i, i + BATCH_SIZE);
      const batchMetadatas = metadatas.slice(i, i + BATCH_SIZE);
      const batchIds = ids.slice(i, i + BATCH_SIZE);

      logger.info(
        `Importing batch ${i / BATCH_SIZE + 1} of ${Math.ceil(documents.length / BATCH_SIZE)}...`,
      );

      await chromaClient.addDocuments({
        collectionName: COLLECTION_NAME,
        documents: batchDocs,
        metadatas: batchMetadatas,
        ids: batchIds,
      });

      importedCount += batchDocs.length;
      logger.info(`Imported ${importedCount}/${documents.length} documents`);
    }

    logger.info("\n✅ Successfully imported all laws to ChromaDB!");
    logger.info(`Total documents imported: ${documents.length}`);

    // Verify the import
    const collectionCount = await chromaClient.countCollection(COLLECTION_NAME);
    logger.info(
      `Total documents in collection '${COLLECTION_NAME}': ${collectionCount}`,
    );
  } catch (error) {
    logger.error({ error }, "❌ Error importing laws to ChromaDB:");
    process.exit(1);
  } finally {
    process.exit(0);
  }
}
