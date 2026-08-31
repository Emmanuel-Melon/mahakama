import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";

import { HttpStatus } from "@/lib/http/http.status";
import { registerRoutes } from "@/lib/openapi/openapi.core";
import type { PathDefinition } from "@/lib/openapi/openapi.types";

import { UserApiSchemas } from "@/feature/users/users.docs";
import { clientsApi } from "./clients.routes";

/*
 * Clients reuse the `user` JSON:API resource type, so the response schemas
 * (UserCollectionResponse, etc.) are already registered by the users docs.
 * We only register the clients path here to avoid duplicate named schemas.
 */
export const clientsRegistry = new OpenAPIRegistry();

const clientPaths: PathDefinition[] = [
  {
    handlerName: "getClientsController",
    method: "get",
    path: clientsApi.path,
    summary: "Get clients",
    description:
      "Returns a list of users who have matters with the authenticated lawyer.",
    security: [{ bearerAuth: [] }],
    successStatus: HttpStatus.SUCCESS,
    successSchema: UserApiSchemas.colResSchema,
    errorCodes: [401, 403, 500],
  },
];

registerRoutes({
  registry: clientsRegistry,
  defaultTag: "Clients v1",
  routes: clientPaths,
});
