import { Router } from "express";
import multer from "multer";
import type { ApiManifest } from "@/routes/api.types";
import { uploadDocumentController } from "./controllers/upload-document.controller";
import { getDocumentStatusController } from "./controllers/get-document-status.controller";
import { deleteDocumentController } from "./controllers/delete-document.controller";
import { DocumentConfig } from "./documents.config";

const router = Router();

// Configure multer for memory storage (for PDF uploads)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: DocumentConfig.MAX_FILE_SIZE_BYTES,
  },
  fileFilter: (_req, file, cb) => {
    if (DocumentConfig.ALLOWED_MIME_TYPES.includes(file.mimetype as any)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          `Invalid file type. Allowed: ${DocumentConfig.ALLOWED_MIME_TYPES.join(", ")}`,
        ),
      );
    }
  },
});

router.post(
  "/:sessionId/document",
  upload.single("file"),
  uploadDocumentController,
);

router.get("/:sessionId/document", getDocumentStatusController);

router.delete("/:sessionId/document", deleteDocumentController);

export const documentsApi: ApiManifest = {
  path: "/v1/sessions",
  router,
};

export default router;
