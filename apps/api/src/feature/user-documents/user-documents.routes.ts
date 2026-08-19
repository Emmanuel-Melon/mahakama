import { Router } from "express";
import multer from "multer";
import type { ApiManifest } from "@/routes/api.types";
import { uploadUserDocumentController } from "./controllers/upload-user-document.controller";
import { getUserDocumentStatusController } from "./controllers/get-user-document-status.controller";
import { deleteUserDocumentController } from "./controllers/delete-user-document.controller";
import { UserDocumentConfig } from "./user-documents.config";

const router = Router();

// Configure multer for memory storage (for PDF uploads)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: UserDocumentConfig.MAX_FILE_SIZE_BYTES,
  },
  fileFilter: (_req, file, cb) => {
    if (UserDocumentConfig.ALLOWED_MIME_TYPES.includes(file.mimetype as any)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          `Invalid file type. Allowed: ${UserDocumentConfig.ALLOWED_MIME_TYPES.join(", ")}`,
        ),
      );
    }
  },
});

router.post(
  "/:sessionId/document",
  upload.single("file"),
  uploadUserDocumentController,
);

router.get("/:sessionId/document", getUserDocumentStatusController);

router.delete("/:sessionId/document", deleteUserDocumentController);

export const userDocumentsApi: ApiManifest = {
  path: "/v1/sessions",
  router,
};

export default router;
