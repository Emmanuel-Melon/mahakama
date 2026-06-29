import { db } from "@/lib/drizzle";
import {
  inferenceProvidersSchema,
  inferenceModelsSchema,
} from "./inference.schema";
import { logger } from "@/lib/logger";

export async function seedInferenceDiscovery() {
  try {
    logger.info("🏗️ Seeding inference providers and models...");

    const providers = [
      { id: "ollama", name: "Ollama (Local)", isExternal: false },
      { id: "gemini", name: "Google Gemini", isExternal: true },
    ];

    await db
      .insert(inferenceProvidersSchema)
      .values(providers)
      .onConflictDoNothing();

    const models = [
      {
        id: "gemma3:1b",
        providerId: "ollama",
        displayName: "Gemma 3 (Lightweight)",
        isPremium: false,
      },
      {
        id: "gemini-2.5-flash",
        providerId: "gemini",
        displayName: "Gemini 2.5 Flash (Pro)",
        isPremium: true,
      },
    ];

    await db.insert(inferenceModelsSchema).values(models).onConflictDoNothing();

    logger.info("✅ Discovery data seeded successfully");
  } catch (error) {
    logger.error({ error }, "❌ Error seeding discovery data");
    throw error;
  }
}
