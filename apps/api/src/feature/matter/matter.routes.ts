import { Router } from "express";
import { getMattersController } from "./controllers/get-matters.controller";
import { getMatterController } from "./controllers/get-matter.controller";
import { openMatterController } from "./controllers/open-matter.controller";
import { getMatterTimelineController } from "./controllers/matter-timeline.controller";
import { updateMatterController } from "./controllers/update-matter.controller";
import {
  HttpLocation,
  validateHttpRequest,
} from "@/middleware/request-validators";
import {
  matterInsertSchema,
  matterLawyerInsertSchema,
  matterLawyerUpdateSchema,
  matterNoteInsertSchema,
  matterUpdateSchema,
} from "./matter.types";
import { z } from "zod";
import type { ApiManifest } from "@/routes/api.types";
import { createMatterLawyerController } from "./controllers/invite-lawyer.controller";
import { updateMatterLawyerMeController } from "./controllers/invite-response.controller";
import { addNoteController } from "./controllers/add-note.controller";
import { getMatterLawyersController } from "./controllers/get-matter-lawyers.controller";
import { getMatterNotesController } from "./controllers/get-matter-notes.controller";
import { getMatterDocumentsController } from "./controllers/get-matter-documents.controller";
import { getMatterDocumentController } from "./controllers/get-matter-document.controller";
import { uploadMatterDocumentController } from "./controllers/upload-matter-document.controller";
import { analyzeMatterDocumentController } from "./controllers/analyze-matter-document.controller";
import { upload } from "@/middleware/multer";

const matterRouter = Router();

matterRouter.get("/", getMattersController);
matterRouter.get(
  "/:id",
  validateHttpRequest(z.object({ id: z.string() }), HttpLocation.Params),
  getMatterController,
);
matterRouter.get(
  "/:matterId/timeline",
  validateHttpRequest(z.object({ matterId: z.string() }), HttpLocation.Params),
  getMatterTimelineController,
);
matterRouter.post(
  "/",
  validateHttpRequest(matterInsertSchema, HttpLocation.Body),
  openMatterController,
);
matterRouter.patch(
  "/:matterId",
  validateHttpRequest(z.object({ matterId: z.string() }), HttpLocation.Params),
  validateHttpRequest(matterUpdateSchema, HttpLocation.Body),
  updateMatterController,
);
matterRouter.get(
  "/:matterId/notes",
  validateHttpRequest(z.object({ matterId: z.string() }), HttpLocation.Params),
  getMatterNotesController,
);
matterRouter.post(
  "/:matterId/notes",
  validateHttpRequest(z.object({ matterId: z.string() }), HttpLocation.Params),
  validateHttpRequest(
    matterNoteInsertSchema.omit({ matterId: true, authorUserId: true }),
    HttpLocation.Body,
  ),
  addNoteController,
);
matterRouter.get(
  "/:matterId/documents",
  validateHttpRequest(z.object({ matterId: z.string() }), HttpLocation.Params),
  getMatterDocumentsController,
);
matterRouter.get(
  "/:matterId/documents/:documentId",
  validateHttpRequest(
    z.object({ matterId: z.string(), documentId: z.string() }),
    HttpLocation.Params,
  ),
  getMatterDocumentController,
);
matterRouter.post(
  "/:matterId/documents/:documentId/analyze",
  validateHttpRequest(
    z.object({ matterId: z.string(), documentId: z.string() }),
    HttpLocation.Params,
  ),
  analyzeMatterDocumentController,
);
matterRouter.post(
  "/:matterId/documents",
  validateHttpRequest(z.object({ matterId: z.string() }), HttpLocation.Params),
  upload.single("file"),
  uploadMatterDocumentController,
);
matterRouter.get(
  "/:matterId/lawyers",
  validateHttpRequest(z.object({ matterId: z.string() }), HttpLocation.Params),
  getMatterLawyersController,
);
matterRouter.post(
  "/:matterId/lawyers",
  validateHttpRequest(z.object({ matterId: z.string() }), HttpLocation.Params),
  validateHttpRequest(
    matterLawyerInsertSchema.omit({ matterId: true }),
    HttpLocation.Body,
  ),
  createMatterLawyerController,
);
matterRouter.patch(
  "/:matterId/lawyers/me",
  validateHttpRequest(z.object({ matterId: z.string() }), HttpLocation.Params),
  validateHttpRequest(matterLawyerUpdateSchema, HttpLocation.Body),
  updateMatterLawyerMeController,
);

export const matterApi: ApiManifest = {
  path: "/v1/matters",
  router: matterRouter,
};

export default matterRouter;
