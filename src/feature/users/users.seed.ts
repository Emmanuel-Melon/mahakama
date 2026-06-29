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

    const insertedUsers = await db
      .insert(usersSchema)
      .values(users)
      .onConflictDoUpdate({
        target: usersSchema.email,
        set: { name: sql`EXCLUDED.name` },
      })
      .returning();

    logger.info(`✅ Successfully seeded ${insertedUsers.length} users`);
    return insertedUsers;
  } catch (error) {
    logger.error({ error }, "❌ Error seeding users");
    throw error;
  }
}
