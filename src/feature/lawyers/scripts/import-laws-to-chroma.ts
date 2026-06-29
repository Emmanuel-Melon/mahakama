import { chromaClient } from "@/lib/chroma";

const COLLECTION_NAME = "legal_questions";

const laws: any[] = [];

async function importLawsToChroma() {
  try {
    console.log("Starting import of laws to ChromaDB...");

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

    console.log(`Prepared ${documents.length} laws for import`);

    // Add documents to ChromaDB in batches to avoid timeouts
    const BATCH_SIZE = 20;
    let importedCount = 0;

    for (let i = 0; i < documents.length; i += BATCH_SIZE) {
      const batchDocs = documents.slice(i, i + BATCH_SIZE);
      const batchMetadatas = metadatas.slice(i, i + BATCH_SIZE);
      const batchIds = ids.slice(i, i + BATCH_SIZE);

      console.log(
        `Importing batch ${i / BATCH_SIZE + 1} of ${Math.ceil(documents.length / BATCH_SIZE)}...`,
      );

      await chromaClient.addDocuments({
        collectionName: COLLECTION_NAME,
        documents: batchDocs,
        metadatas: batchMetadatas,
        ids: batchIds,
      });

      importedCount += batchDocs.length;
      console.log(`Imported ${importedCount}/${documents.length} documents`);
    }

    console.log("\n✅ Successfully imported all laws to ChromaDB!");
    console.log(`Total documents imported: ${documents.length}`);

    // Verify the import
    const collectionCount = await chromaClient.countCollection(COLLECTION_NAME);
    console.log(
      `Total documents in collection '${COLLECTION_NAME}': ${collectionCount}`,
    );
  } catch (error) {
    console.error("❌ Error importing laws to ChromaDB:", error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

// Run the import
importLawsToChroma();
