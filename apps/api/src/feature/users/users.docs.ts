import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { HttpStatus } from "@/lib/http/http.status";
import {
  defineApiResource,
  registerJsonApiSchemas,
  registerRoutes,
} from "@/lib/openapi/openapi.core";
import type { PathDefinition } from "@/lib/openapi/openapi.types";

import { usersApi } from "./users.routes";
import { usersInsertSchema, usersSelectSchema } from "./users.types";

export const usersRegistry = new OpenAPIRegistry();

const userApiResource = defineApiResource({
  select: usersSelectSchema,
  insert: usersInsertSchema,
  update: usersInsertSchema.partial(),
});

export const UserApiSchemas = registerJsonApiSchemas({
  registry: usersRegistry,
  resourceType: "user",
  pascalName: "User",
  schemas: userApiResource,
});

const userPaths: PathDefinition[] = [
  {
    handlerName: "getCurrentUserController",
    method: "get",
    path: "/v1/users/me",
    summary: "Get current authenticated user's information",
    description:
      "Returns the currently authenticated user's profile information.",
    security: [{ bearerAuth: [] }],
    successStatus: HttpStatus.SUCCESS,
    successSchema: UserApiSchemas.singleResSchema,
    errorCodes: [401, 500],
  },
  {
    handlerName: "getAllUsersController",
    method: "get",
    path: usersApi.path,
    summary: "Get all users",
    description:
      "Returns a paginated list of users with filtering and sorting options",
    security: [{ bearerAuth: [] }],
    successStatus: HttpStatus.SUCCESS,
    successSchema: UserApiSchemas.colResSchema,
    errorCodes: [401, 403],
  },
  {
    handlerName: "getUserByIdController",
    method: "get",
    path: `${usersApi.path}/{id}`,
    summary: "Get user by ID",
    description:
      "Retrieve user details by user ID. Users can only view their own profile unless they are admins.",
    security: [{ bearerAuth: [] }],
    successStatus: HttpStatus.SUCCESS,
    successSchema: UserApiSchemas.singleResSchema,
    errorCodes: [401, 403, 404],
  },
  {
    handlerName: "createUserController",
    method: "post",
    path: usersApi.path,
    summary: "Create a new user",
    description:
      "Register a new user account. Can be used for both anonymous and registered users.",
    security: [{ bearerAuth: [] }],
    requestBodySchema: usersInsertSchema,
    successStatus: HttpStatus.CREATED,
    successSchema: UserApiSchemas.singleResSchema,
    errorCodes: [400, 401, 409],
  },
];

registerRoutes({
  registry: usersRegistry,
  defaultTag: "Users v1",
  routes: userPaths,
});

usersRegistry.register("User", usersSelectSchema);
usersRegistry.register("NewUser", usersInsertSchema);
