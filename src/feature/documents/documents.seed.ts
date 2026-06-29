import "dotenv/config";
import { db } from "@/lib/drizzle";
import { documentsTable } from "@/feature/documents/documents.schema";
import { logger } from "@/lib/logger";
import { documentData } from "@/feature/documents/documents.constants";

export async function seedDocuments() {
  try {
    await db.delete(documentsTable);

    const documentsToInsert = documentData.map((doc) => ({
      title: doc.title,
      description: doc.description,
      type: doc.type,
      sections: doc.sections,
      lastUpdated: doc.lastUpdated,
      storageUrl: doc.storageUrl,
      downloadCount: 0,
    }));

    const insertedDocuments = await db
      .insert(documentsTable)
      .values(documentsToInsert)
      .returning();
    logger.info(`Successfully seeded ${insertedDocuments.length} documents`);
    logger.info({ insertedDocuments }, "Seeded documents:");
  } catch (error) {
    logger.error({ error }, "Error seeding documents:");
    process.exit(1);
  }
}
