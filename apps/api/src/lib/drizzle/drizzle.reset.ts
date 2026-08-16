import { Pool } from "pg";
import { dbConfig } from "@/config";
import { logger } from "@/lib/logger";

async function resetDatabase() {
  if (process.env.NODE_ENV === "production") {
    logger.error("Cannot reset database in production. Aborting.");
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: dbConfig.postgres.url,
  });

  logger.info("🌪️  Starting database reset...");

  try {
    await pool.query(`
      DROP SCHEMA public CASCADE;
      CREATE SCHEMA public;
      GRANT ALL ON SCHEMA public TO public;
      COMMENT ON SCHEMA public IS 'standard public schema';
    `);

    logger.info("✅ Database wiped clean.");
  } catch (error) {
    logger.error({ error }, "Failed to reset database:");
  } finally {
    await pool.end();
  }
}

resetDatabase();
