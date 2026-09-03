import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { HttpStatus } from "@/lib/http/http.status";
import {
  defineApiResource,
  registerJsonApiSchemas,
  registerRoutes,
} from "@/lib/openapi/openapi.core";
import type { PathDefinition } from "@/lib/openapi/openapi.types";

import { orgsApi } from "./orgs.routes";
import {
  orgSelectSchema,
  orgInsertSchema,
  orgUpdateSchema,
  orgMemberSelectSchema,
  orgMemberInsertSchema,
  orgMemberUpdateSchema,
} from "./orgs.types";

export const orgsRegistry = new OpenAPIRegistry();

const orgApiResource = defineApiResource({
  select: orgSelectSchema,
  insert: orgInsertSchema,
  update: orgUpdateSchema,
});

export const OrgApiSchemas = registerJsonApiSchemas({
  registry: orgsRegistry,
  resourceType: "org",
  pascalName: "Org",
  schemas: orgApiResource,
});

const orgMemberApiResource = defineApiResource({
  select: orgMemberSelectSchema,
  insert: orgMemberInsertSchema,
  update: orgMemberUpdateSchema,
});

export const OrgMemberApiSchemas = registerJsonApiSchemas({
  registry: orgsRegistry,
  resourceType: "org-member",
  pascalName: "OrgMember",
  schemas: orgMemberApiResource,
});

const orgPaths: PathDefinition[] = [
  {
    handlerName: "getOrgsController",
    method: "get",
    path: orgsApi.path,
    summary: "Get all organizations",
    description:
      "Returns a paginated list of organizations with filtering and sorting options",
    security: [{ bearerAuth: [] }],
    successStatus: HttpStatus.SUCCESS,
    successSchema: OrgApiSchemas.colResSchema,
    errorCodes: [401, 403, 500],
  },
  {
    handlerName: "createOrgController",
    method: "post",
    path: orgsApi.path,
    summary: "Create a new organization",
    description: "Creates a new organization and adds the creator as an owner",
    security: [{ bearerAuth: [] }],
    requestBodySchema: orgInsertSchema.omit({ createdByUserId: true }),
    successStatus: HttpStatus.CREATED,
    successSchema: OrgApiSchemas.singleResSchema,
    errorCodes: [400, 401, 409, 500],
  },
  {
    handlerName: "getOrgController",
    method: "get",
    path: `${orgsApi.path}/{orgId}`,
    summary: "Get organization by ID",
    description: "Retrieve organization details by organization ID",
    security: [{ bearerAuth: [] }],
    successStatus: HttpStatus.SUCCESS,
    successSchema: OrgApiSchemas.singleResSchema,
    errorCodes: [401, 403, 404, 500],
    requestParams: z.object({ orgId: z.string() }),
  },
  {
    handlerName: "updateOrgController",
    method: "patch",
    path: `${orgsApi.path}/{orgId}`,
    summary: "Update organization",
    description: "Update an existing organization's information",
    security: [{ bearerAuth: [] }],
    requestBodySchema: orgUpdateSchema,
    successStatus: HttpStatus.SUCCESS,
    successSchema: OrgApiSchemas.singleResSchema,
    errorCodes: [400, 401, 403, 404, 500],
    requestParams: z.object({ orgId: z.string() }),
  },
  {
    handlerName: "getOrgMembersController",
    method: "get",
    path: `${orgsApi.path}/{orgId}/members`,
    summary: "Get organization members",
    description:
      "Returns a paginated list of organization members with filtering options",
    security: [{ bearerAuth: [] }],
    successStatus: HttpStatus.SUCCESS,
    successSchema: OrgMemberApiSchemas.colResSchema,
    errorCodes: [401, 403, 404, 500],
    requestParams: z.object({ orgId: z.string() }),
  },
  {
    handlerName: "inviteOrgMemberController",
    method: "post",
    path: `${orgsApi.path}/{orgId}/members`,
    summary: "Invite a member to organization",
    description: "Invites a user to join the organization",
    security: [{ bearerAuth: [] }],
    requestBodySchema: orgMemberInsertSchema.omit({
      orgId: true,
      invitedAt: true,
    }),
    successStatus: HttpStatus.CREATED,
    successSchema: OrgMemberApiSchemas.singleResSchema,
    errorCodes: [400, 401, 403, 404, 409, 500],
    requestParams: z.object({ orgId: z.string() }),
  },
  {
    handlerName: "updateOrgMemberController",
    method: "patch",
    path: `${orgsApi.path}/{orgId}/members/{userId}`,
    summary: "Update organization member",
    description: "Update an organization member's role or status",
    security: [{ bearerAuth: [] }],
    requestBodySchema: orgMemberUpdateSchema,
    successStatus: HttpStatus.SUCCESS,
    successSchema: OrgMemberApiSchemas.singleResSchema,
    errorCodes: [400, 401, 403, 404, 500],
    requestParams: z.object({ orgId: z.string(), userId: z.string() }),
  },
  {
    handlerName: "removeOrgMemberController",
    method: "delete",
    path: `${orgsApi.path}/{orgId}/members/{userId}`,
    summary: "Remove organization member",
    description: "Remove a member from the organization",
    security: [{ bearerAuth: [] }],
    successStatus: HttpStatus.SUCCESS,
    successSchema: OrgMemberApiSchemas.singleResSchema,
    errorCodes: [401, 403, 404, 500],
    requestParams: z.object({ orgId: z.string(), userId: z.string() }),
  },
];

registerRoutes({
  registry: orgsRegistry,
  defaultTag: "Organizations v1",
  routes: orgPaths,
});

orgsRegistry.register("Org", orgSelectSchema);
orgsRegistry.register("NewOrg", orgInsertSchema);
orgsRegistry.register("OrgMember", orgMemberSelectSchema);
orgsRegistry.register("NewOrgMember", orgMemberInsertSchema);