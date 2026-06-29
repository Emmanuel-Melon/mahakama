import { Router } from "express";
import { getDocumentByIdControlle } from "./controllers/get-document-by-id.controller";
import { getDocumentsController } from "./controllers/get-documents.controller";
import { createDocumentHandler } from "./controllers/create-document.controller";
import { bookmarkDocumentController } from "./controllers/bookmark-document.controller";
import { downloadDocumentController } from "./controllers/download-document.controller";
import { ingestDocumentController } from "./controllers/ingest-document.controller";
import { upload } from "@/middleware/multer";

export const DOCUMENTS_PATH = "/v1/documents";

const documentRoutes = Router();
documentRoutes.get("/", getDocumentsController);
documentRoutes.get("/:documentId", getDocumentByIdControlle);
documentRoutes.post("/", createDocumentHandler);
documentRoutes.post("/:documentId/bookmark", bookmarkDocumentController);
documentRoutes.get("/:documentId/download", downloadDocumentController);
documentRoutes.post("/ingest", upload.single("file"), ingestDocumentController);

export default documentRoutes;
