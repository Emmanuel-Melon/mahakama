import { Router } from "express";
import { z } from "zod";

import {
  HttpLocation,
  validateHttpRequest,
} from "@/middleware/request-validators";
import { optionalAuth } from "@/middleware/auth";
import { useAuthorization } from "@/routes/api.rules";
import type { ApiManifest } from "@/routes/api.types";

import {
  createLawyerSchema,
  lawyersUpdateSchema,
  rejectLawyerSchema,
  createLawyerInviteSchema,
} from "./lawyers.types";

import { getLawyersController } from "./controllers/get-lawyers.controller";
import { getLawyerByIdController } from "./controllers/get-lawyer-by-id.controller";
import { createLawyerController } from "./controllers/create-lawyer.controller";
import { updateLawyerController } from "./controllers/update-lawyer.controller";
import { getProfileController } from "./controllers/get-profile.controller";
import { upsertProfileController } from "./controllers/upsert-profile.controller";
import { submitProfileController } from "./controllers/submit-profile.controller";
import {
  approveLawyerController,
  rejectLawyerController,
} from "./controllers/review-lawyer.controller";
import { lawyerDirectoryController } from "./controllers/lawyer-directory.controller";
import { listInvitesController } from "./controllers/list-invites.controller";
import { createInviteController } from "./controllers/create-invite.controller";
import { updateInviteController } from "./controllers/update-invite.controller";
import { uploadDocumentController } from "./controllers/upload-document.controller";
import { deleteDocumentController } from "./controllers/delete-document.controller";

const lawyersRoutes = Router();

useAuthorization(lawyersRoutes, [
  { path: "/profile", roles: ["lawyer"] },
  { path: "/profile/submit", roles: ["lawyer"] },
  { path: "/profile/documents", roles: ["lawyer"] },
  { path: "/profile/documents/:documentId", roles: ["lawyer"] },
  { path: "/invites", roles: ["admin"] },
  { path: "/invites/:inviteId", roles: ["admin"] },
  { path: "/:id/approve", roles: ["admin"] },
  { path: "/:id/reject", roles: ["admin"] },
]);

lawyersRoutes.get("/directory", optionalAuth, lawyerDirectoryController);
lawyersRoutes.get("/profile", getProfileController);
lawyersRoutes.post(
  "/profile",
  validateHttpRequest(createLawyerSchema, HttpLocation.Body),
  upsertProfileController,
);
lawyersRoutes.patch(
  "/profile",
  validateHttpRequest(lawyersUpdateSchema, HttpLocation.Body),
  upsertProfileController,
);
lawyersRoutes.post("/profile/submit", submitProfileController);
lawyersRoutes.post(
  "/profile/documents",
  validateHttpRequest(
    z.object({
      type: z.enum(["bar_certificate", "national_id", "other"]),
      fileUrl: z.string().url(),
    }),
    HttpLocation.Body,
  ),
  uploadDocumentController,
);
lawyersRoutes.delete(
  "/profile/documents/:documentId",
  validateHttpRequest(
    z.object({ documentId: z.string().uuid() }),
    HttpLocation.Params,
  ),
  deleteDocumentController,
);

/*
 * ADMIN ROUTES (authenticated, admin role)
 */

lawyersRoutes.get("/invites", listInvitesController);
lawyersRoutes.post(
  "/invites",
  validateHttpRequest(createLawyerInviteSchema, HttpLocation.Body),
  createInviteController,
);
lawyersRoutes.patch(
  "/invites/:inviteId",
  validateHttpRequest(
    z.object({ inviteId: z.string().uuid() }),
    HttpLocation.Params,
  ),
  validateHttpRequest(
    z.object({ status: z.enum(["pending", "accepted", "expired", "revoked"]) }),
    HttpLocation.Body,
  ),
  updateInviteController,
);
lawyersRoutes.get("/", getLawyersController);
lawyersRoutes.get(
  "/:id",
  validateHttpRequest(z.object({ id: z.string().uuid() }), HttpLocation.Params),
  getLawyerByIdController,
);
lawyersRoutes.post(
  "/",
  validateHttpRequest(createLawyerSchema, HttpLocation.Body),
  createLawyerController,
);
lawyersRoutes.put(
  "/:id",
  validateHttpRequest(z.object({ id: z.string().uuid() }), HttpLocation.Params),
  validateHttpRequest(lawyersUpdateSchema, HttpLocation.Body),
  updateLawyerController,
);
lawyersRoutes.patch(
  "/:id/approve",
  validateHttpRequest(z.object({ id: z.string().uuid() }), HttpLocation.Params),
  approveLawyerController,
);
lawyersRoutes.patch(
  "/:id/reject",
  validateHttpRequest(z.object({ id: z.string().uuid() }), HttpLocation.Params),
  validateHttpRequest(rejectLawyerSchema, HttpLocation.Body),
  rejectLawyerController,
);

export const lawyersApi: ApiManifest = {
  path: "/v1/lawyers",
  router: lawyersRoutes,
};

export default lawyersRoutes;
