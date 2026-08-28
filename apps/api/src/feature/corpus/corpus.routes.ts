import { Router } from "express";
import { z } from "zod";

import {
  HttpLocation,
  validateHttpRequest,
} from "@/middleware/request-validators";
import { upload } from "@/middleware/multer";
import { useAuthorization } from "@/routes/api.rules";
import type { ApiManifest } from "@/routes/api.types";

import { bookmarkCorpusController } from "./controllers/bookmark-corpus.controller";
import { createCorpusHandler } from "./controllers/create-corpus.controller";
import { downloadCorpusController } from "./controllers/download-corpus.controller";
import { getCorpusByIdController } from "./controllers/get-corpus-by-id.controller";
import { getCorpusController } from "./controllers/get-corpus.controller";
import { ingestCorpusController } from "./controllers/ingest-corpus.controller";
import { corpusInsertSchema } from "./corpus.types";

const corpusRoutes = Router();

useAuthorization(corpusRoutes, [
  { path: "/ingest", roles: ["admin"] },
]);

corpusRoutes.get("/", getCorpusController);
corpusRoutes.get(
  "/:documentId",
  validateHttpRequest(
    z.object({ documentId: z.string() }),
    HttpLocation.Params,
  ),
  getCorpusByIdController,
);
corpusRoutes.post(
  "/",
  validateHttpRequest(corpusInsertSchema, HttpLocation.Body),
  createCorpusHandler,
);
corpusRoutes.post(
  "/:documentId/bookmark",
  validateHttpRequest(
    z.object({ documentId: z.string() }),
    HttpLocation.Params,
  ),
  bookmarkCorpusController,
);
corpusRoutes.get(
  "/:documentId/download",
  validateHttpRequest(
    z.object({ documentId: z.string() }),
    HttpLocation.Params,
  ),
  downloadCorpusController,
);
corpusRoutes.post("/ingest", upload.single("file"), ingestCorpusController);

export const corpusApi: ApiManifest = {
  path: "/v1/corpus",
  router: corpusRoutes,
};

export default corpusRoutes;