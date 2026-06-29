import { glob } from "glob";
import { logger } from "@/lib/logger";
import path from "path";

export const randomElement = <T>(array: T[]): T =>
  array[Math.floor(Math.random() * array.length)];

async function main() {
  try {
    logger.info("🚀 Starting Global Database Seed...");

    // Find all files ending in .seed.ts
    const seedFiles = await glob("src/feature/**/*.seed.ts", {
      absolute: true,
    });

    // Optional: Sort them if you have 001, 002 prefixes
    seedFiles.sort();

    for (const filePath of seedFiles) {
      // Dynamically import the seed file
      const module = await import(`file://${filePath}`);

      // Look for any exported function that starts with 'seed'
      const seedFunctionName = Object.keys(module).find((key) =>
        key.startsWith("seed"),
      );

      if (seedFunctionName && typeof module[seedFunctionName] === "function") {
        await module[seedFunctionName]();
      } else {
        logger.warn(`⚠️ No seed function found in ${path.basename(filePath)}`);
      }
    }

    logger.info("\n🎉 All seeds completed successfully!");
    process.exit(0);
  } catch (error) {
    logger.error({ error }, "\n💥 Global seeding failed:");
    process.exit(1);
  }
}

main();
