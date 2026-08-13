import { parsePdfFromPath } from "@/lib/pdf-parse/";
import { getStoragePath } from "@/lib/storage/storage";
import { chunkDocument } from "@/services/rag-service/rag.chunker";
import { generateDocumentEmbeddings } from "@/services/embedding-service/embeddings.generate";
import { logger } from "@/lib/logger";
import { findDocumentById } from "../operations/document.find";
import { unwrapJobResult } from "@/lib/bullmq/bullmq.utils";
import { DocumentJobs } from "../document.config";
import { DocumentJobMap } from "../documents.types";

const COLLECTION_NAME = "legal_questions";

export class DocumentsJobHandler {
  static async handleDocumentUploaded(
    data: DocumentJobMap[typeof DocumentJobs.DocumentUploaded],
  ) {
    const { documentId, userId } = data;
    const document = unwrapJobResult(await findDocumentById(documentId), {
      message: "Could not find document",
      shouldRetry: false,
    });
    const { id, storageUrl } = document.data!;

    // 1. Read document from local storage and extract text
    const fileContent = await parsePdfFromPath(getStoragePath(storageUrl));

    // 2. Chunk document into sections
    const chunks = chunkDocument(
      {
        documentId: id,
        text: fileContent.text,
      },
      {
        chunkSize: 1000, // tokens
        overlapSize: 200,
      },
    );
    // 3. Generate and store embeddings
    const embeddings = await generateDocumentEmbeddings(chunks, {
      collectionName: COLLECTION_NAME,
      limit: 20,
    });
    logger.info({ documentId, userId }, "Document processed successfully");
    return { success: true, documentId, userId };
  }
}
