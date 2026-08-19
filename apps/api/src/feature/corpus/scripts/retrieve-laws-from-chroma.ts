import { logger } from "@/lib/logger";
import { LegalCorpusChunk } from "../corpus.types";
import { findEmbedding } from "@/service/embedding-service/operations/embeddings.find";

const COLLECTION_NAME = "legal_questions";

async function retrieveLaws(
  query: string,
  limit: number = 5,
): Promise<LegalCorpusChunk[]> {
  try {
    logger.info(`Searching for laws related to: "${query}"`);

    // Query ChromaDB
    const embeddings = await findEmbedding(query, {
      collectionName: COLLECTION_NAME,
      limit,
    });

    if (!embeddings?.ids?.length) {
      logger.info("No matching laws found.");
      return [];
    }

    // Transform embeddings into LegalCorpusChunk format
    const laws: LegalCorpusChunk[] = [];

    for (let i = 0; i < embeddings.ids.length; i++) {
      const id = embeddings.ids[i];
      const metadata = embeddings.metadatas?.[i] || {};
      const document = embeddings.documents?.[i] || "";
      const distance = embeddings.distances?.[i] || 0;

      // Calculate similarity score (1 - distance)
      const similarity = 1 - Math.min(Math.max(distance, 0), 1);

      // Ensure document is a string
      const docString = String(document);
      const title = String(metadata?.title || "");

      // Extract content (remove title if it was prepended)
      let content = docString;
      if (title && docString.startsWith(title)) {
        content = docString.substring(title.length).trim();
        if (content.startsWith(". ")) content = content.substring(1).trim();
      }

      laws.push({
        id: String(id),
        title: String(metadata?.title || `Law ${i + 1}`),
        category: String(metadata?.category || "Uncategorized"),
        source: String(metadata?.source || "Unknown"),
        content: content,
        similarity: parseFloat(similarity.toFixed(4)),
      });
    }

    // Sort by similarity (highest first)
    laws.sort((a, b) => (b.similarity || 0) - (a.similarity || 0));

    return laws;
  } catch (error) {
    logger.error({ error }, "Error retrieving laws from ChromaDB:");
    throw error;
  }
}

// Example usage
async function main() {
  try {
    // Get query from command line arguments or use a default
    const query = "rights of citizens";
    const limit = 5;

    logger.info(`\nSearching for: "${query}"`);
    logger.info(`Showing top ${limit} embeddings\n`);

    const laws = await retrieveLaws(query, limit);

    if (laws.length === 0) {
      logger.info("No matching laws found.");
      return;
    }

    // Display embeddings
    laws.forEach((law, index) => {
      logger.info(
        `${index + 1}. ${law.title} (Similarity: ${(law.similarity! * 100).toFixed(1)}%)`,
      );
      logger.info(`   Category: ${law.category}`);
      logger.info(`   Source: ${law.source}`);
      logger.info(
        `   ${law.content.substring(0, 150)}${law.content.length > 150 ? "..." : ""}\n`,
      );
    });
  } catch (error) {
    logger.error({ error }, "An error occurred:");
  }
}

// Run the script
main().catch(logger.error);
