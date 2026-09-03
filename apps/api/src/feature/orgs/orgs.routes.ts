import { Router } from "express";
import { z } from "zod";
import { getOrgsController } from "./controllers/get-orgs.controller";
import { createOrgController } from "./controllers/create-org.controller";
import { getOrgController } from "./controllers/get-org.controller";
import { updateOrgController } from "./controllers/update-org.controller";
import { getOrgMembersController } from "./controllers/get-org-members.controller";
import { inviteOrgMemberController } from "./controllers/invite-org-member.controller";
import { updateOrgMemberController } from "./controllers/update-org-member.controller";
import { removeOrgMemberController } from "./controllers/remove-org-member.controller";
import {
  HttpLocation,
  validateHttpRequest,
} from "@/middleware/request-validators";
import { orgInsertSchema, orgUpdateSchema, orgMemberInsertSchema } from "./orgs.types";
import { useAuthorization } from "@/routes/api.rules";
import type { ApiManifest } from "@/routes/api.types";

const orgsRouter = Router();

useAuthorization(orgsRouter, [
  { path: "/", roles: ["user", "lawyer"] },
  { path: "/:orgId", roles: ["user", "lawyer"] },
  { path: "/:orgId/members", roles: ["user", "lawyer"] },
]);

orgsRouter.get("/", getOrgsController);
orgsRouter.post(
  "/",
  validateHttpRequest(
    orgInsertSchema.omit({ createdByUserId: true }),
    HttpLocation.Body,
  ),
  createOrgController,
);
orgsRouter.get(
  "/:orgId",
  validateHttpRequest(z.object({ orgId: z.string() }), HttpLocation.Params),
  getOrgController,
);
orgsRouter.patch(
  "/:orgId",
  validateHttpRequest(z.object({ orgId: z.string() }), HttpLocation.Params),
  validateHttpRequest(orgUpdateSchema, HttpLocation.Body),
  updateOrgController,
);

orgsRouter.get(
  "/:orgId/members",
  validateHttpRequest(z.object({ orgId: z.string() }), HttpLocation.Params),
  getOrgMembersController,
);
orgsRouter.post(
  "/:orgId/members",
  validateHttpRequest(z.object({ orgId: z.string() }), HttpLocation.Params),
  validateHttpRequest(
    orgMemberInsertSchema.omit({ orgId: true, invitedAt: true }),
    HttpLocation.Body,
  ),
  inviteOrgMemberController,
);
orgsRouter.patch(
  "/:orgId/members/:userId",
  validateHttpRequest(
    z.object({ orgId: z.string(), userId: z.string() }),
    HttpLocation.Params,
  ),
  validateHttpRequest(
    orgMemberInsertSchema
      .omit({ id: true, orgId: true, userId: true, invitedAt: true })
      .partial()
      .extend({
        joinedAt: z.coerce.date().nullable().optional(),
      }),
    HttpLocation.Body,
  ),
  updateOrgMemberController,
);
orgsRouter.delete(
  "/:orgId/members/:userId",
  validateHttpRequest(
    z.object({ orgId: z.string(), userId: z.string() }),
    HttpLocation.Params,
  ),
  removeOrgMemberController,
);

export const orgsApi: ApiManifest = {
  path: "/v1/orgs",
  router: orgsRouter,
};

export default orgsRouter;
