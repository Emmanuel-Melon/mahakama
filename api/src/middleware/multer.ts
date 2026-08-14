import multer from "multer";
import { storageConfig } from "@/config";

const MAX_UPLOAD_BYTES = storageConfig.maxUploadMb * 1024 * 1024;

export const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"));
    }
  },
  limits: {
    fileSize: MAX_UPLOAD_BYTES,
  },
});
