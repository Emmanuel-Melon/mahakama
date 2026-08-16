import { Router } from "express";
import { z } from "zod";

import {
  HttpLocation,
  validateHttpRequest,
} from "@/middleware/request-validators";
import { upload } from "@/middleware/multer";
import type { ApiManifest } from "@/routes/api.types";

import { bookmarkDocumentController } from "./controllers/bookmark-document.controller";
import { createDocumentHandler } from "./controllers/create-document.controller";
import { downloadDocumentController } from "./controllers/download-document.controller";
import { getDocumentByIdControlle } from "./controllers/get-document-by-id.controller";
import { getDocumentsController } from "./controllers/get-documents.controller";
import { ingestDocumentController } from "./controllers/ingest-document.controller";
import { documentInsertSchema } from "./documents.types";

const documentRoutes = Router();

documentRoutes.get("/", getDocumentsController);
documentRoutes.get(
  "/:documentId",
  validateHttpRequest(
    z.object({ documentId: z.string() }),
    HttpLocation.Params,
  ),
  getDocumentByIdControlle,
);
documentRoutes.post(
  "/",
  validateHttpRequest(documentInsertSchema, HttpLocation.Body),
  createDocumentHandler,
);
documentRoutes.post(
  "/:documentId/bookmark",
  validateHttpRequest(
    z.object({ documentId: z.string() }),
    HttpLocation.Params,
  ),
  bookmarkDocumentController,
);
documentRoutes.get(
  "/:documentId/download",
  validateHttpRequest(
    z.object({ documentId: z.string() }),
    HttpLocation.Params,
  ),
  downloadDocumentController,
);
documentRoutes.post("/ingest", upload.single("file"), ingestDocumentController);

export const documentsApi: ApiManifest = {
  path: "/v1/documents",
  router: documentRoutes,
};

export default documentRoutes;
