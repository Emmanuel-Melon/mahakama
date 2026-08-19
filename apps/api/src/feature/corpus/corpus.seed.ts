import "dotenv/config";
import { db } from "@/lib/drizzle";
import { documentsTable } from "@/feature/corpus/corpus.schema";
import { logger } from "@/lib/logger";
import { corpusData } from "@/feature/corpus/corpus.constants";
import { generateSamples } from "@/lib/storage/samples";
import { serverConfig } from "@/config";

export async function seedCorpus() {
  try {
    await generateSamples();
    await db.delete(documentsTable);

    const corpusToInsert = corpusData.map((doc) => ({
      title: doc.title,
      description: doc.description,
      type: doc.type,
      sections: doc.sections,
      lastUpdated: doc.lastUpdated,
      storageUrl: `${serverConfig.baseUrl}${doc.storageUrl}`,
      downloadCount: 0,
    }));

    const insertedCorpus = await db
      .insert(documentsTable)
      .values(corpusToInsert)
      .returning();
    logger.info(`Successfully seeded ${insertedCorpus.length} corpus entries`);
    logger.info({ insertedCorpus }, "Seeded corpus entries:");
  } catch (error) {
    logger.error({ error }, "Error seeding corpus:");
    process.exit(1);
  }
}
