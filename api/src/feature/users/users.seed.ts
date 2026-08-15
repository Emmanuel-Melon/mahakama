import { db } from "@/lib/drizzle";
import { usersSchema } from "@/feature/users/users.schema";
import { logger } from "@/lib/logger";
import { createMockUser } from "./users.factory";
import { sql } from "drizzle-orm";

const NUMBER_OF_USERS = 150;

export async function seedUsers() {
  try {
    logger.info("👥 Seeding users...");

    // Clear dependencies
    await db.execute(sql`TRUNCATE TABLE "chat_sessions" CASCADE`);
    await db.delete(usersSchema);

    const users = Array.from({ length: NUMBER_OF_USERS }, () =>
      createMockUser(),
    );

    // Define batch size to prevent parameter overflow
    const BATCH_SIZE = 50;
    let insertedCount = 0;

    for (let i = 0; i < users.length; i += BATCH_SIZE) {
      const batch = users.slice(i, i + BATCH_SIZE);

      const insertedBatch = await db
        .insert(usersSchema)
        .values(batch)
        .onConflictDoUpdate({
          target: usersSchema.email,
          set: { name: sql`EXCLUDED.name` },
        })
        .returning();

      insertedCount += insertedBatch.length;
    }

    logger.info(`✅ Successfully seeded ${insertedCount} users`);
    return insertedCount;
  } catch (error) {
    logger.error({ error }, "❌ Error seeding users");
    throw error;
  }
}
