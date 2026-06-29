import fs from "fs";
import path from "path";
import pLimit from "p-limit";
import { db } from "@/lib/drizzle";
import { documentsTable } from "../documents.schema";
import {
  uploadPublicDocument,
  uploadFileToBucket,
} from "@/lib/supabase/storage";
import { logger } from "@/lib/logger";
import { NewDocument } from "../documents.types";
import { toResult } from "@/lib/drizzle/drizzle.utils";
import { DbResult } from "@/lib/drizzle/drizzle.types";

const LOCAL_FOLDER = "./import-queue";
const CONCURRENCY_LIMIT = 10;
const limit = pLimit(CONCURRENCY_LIMIT);

export async function ingestDocument(
  file: Express.Multer.File,
): Promise<DbResult<Document>> {
  const uploadResult = await uploadPublicDocument(
    file.buffer,
    file.originalname,
    file.mimetype,
  );
  const [document] = await db
    .insert(documentsTable)
    .values({
      title: file.originalname.replace(".pdf", "").replace(/-/g, " "),
      description: "Processing...",
      type: "law",
      sections: 0,
      lastUpdated: new Date().getFullYear().toString(),
      storageUrl: uploadResult.publicUrl,
      downloadCount: 0,
    })
    .returning();

  return toResult(document);
}

async function uploadAndRegisterLocalFile(filePath: string) {
  const fileName = path.basename(filePath);
  const fileBuffer = fs.readFileSync(filePath);

  try {
    const uploadResult = await uploadPublicDocument(
      fileBuffer,
      fileName,
      "application/pdf",
    );

    await db.insert(documentsTable).values({
      title: fileName.replace(".pdf", "").replace(/-/g, " "),
      description: "Imported legal document",
      storageUrl: uploadResult.publicUrl,
      type: "act",
      sections: 0,
      lastUpdated: new Date().getFullYear().toString(),
    });

    logger.info(`✅ Success: ${fileName}`);
  } catch (error) {
    logger.error({ error }, `❌ Error processing ${fileName}:`);
  }
}

export async function runBulkImport() {
  if (!fs.existsSync(LOCAL_FOLDER)) {
    logger.error(`Folder ${LOCAL_FOLDER} not found.`);
    return;
  }

  const files = fs.readdirSync(LOCAL_FOLDER).filter((f) => f.endsWith(".pdf"));
  logger.info(`🚀 Starting ingestion of ${files.length} documents...`);

  const tasks = files.map((file) => {
    return limit(() =>
      uploadAndRegisterLocalFile(path.join(LOCAL_FOLDER, file)),
    );
  });

  await Promise.all(tasks);
  logger.info("🏁 Bulk ingestion complete!");
}
