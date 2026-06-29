import { chromaClient } from "@/lib/chroma";

const COLLECTION_NAME = "legal_questions";

interface LawDocument {
  id: string;
  title: string;
  category: string;
  source: string;
  content: string;
  similarity?: number;
}

async function retrieveLaws(
  query: string,
  limit: number = 5,
): Promise<LawDocument[]> {
  try {
    console.log(`Searching for laws related to: "${query}"`);

    // Query ChromaDB
    const results = await chromaClient.query({
      collectionName: COLLECTION_NAME,
      queryTexts: query,
      nResults: limit,
    });

    if (!results?.ids?.[0]?.length) {
      console.log("No matching laws found.");
      return [];
    }

    // Transform results into LawDocument format
    const laws: LawDocument[] = [];

    for (let i = 0; i < results.ids[0].length; i++) {
      const id = results.ids[0][i];
      const metadata = results.metadatas?.[0]?.[i] || {};
      const document = results.documents?.[0]?.[i] || "";
      const distance = results.distances?.[0]?.[i] || 0;

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
    console.error("❌ Error retrieving laws from ChromaDB:", error);
    throw error;
  }
}

// Example usage
async function main() {
  try {
    // Get query from command line arguments or use a default
    const query = process.argv[2] || "rights of citizens";
    const limit = parseInt(process.argv[3]) || 5;

    console.log(`\n🔍 Searching for: "${query}"`);
    console.log(`📚 Showing top ${limit} results\n`);

    const laws = await retrieveLaws(query, limit);

    if (laws.length === 0) {
      console.log("No matching laws found.");
      return;
    }

    // Display results
    laws.forEach((law, index) => {
      console.log(
        `📌 ${index + 1}. ${law.title} (Similarity: ${(law.similarity! * 100).toFixed(1)}%)`,
      );
      console.log(`   📚 Category: ${law.category}`);
      console.log(`   📜 Source: ${law.source}`);
      console.log(
        `   📝 ${law.content.substring(0, 150)}${law.content.length > 150 ? "..." : ""}\n`,
      );
    });
  } catch (error) {
    console.error("❌ An error occurred:", error);
    process.exit(1);
  }
}

// Run the script
main().catch(console.error);
