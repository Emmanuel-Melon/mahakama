import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { userSelectSchema, userInsertSchema } from "./users.types";
import { HttpStatus } from "@/http-status";
import {
  createJsonApiResourceSchema,
  createJsonApiSingleResponseSchema,
  createJsonApiCollectionResponseSchema,
} from "@/lib/express/express.serializer";

const ErrorResponseRef = { $ref: "#/components/schemas/JsonApiErrorResponse" };
const userResourceSchema = createJsonApiResourceSchema(
  "user",
  userSelectSchema,
);
const userSingleResponseSchema =
  createJsonApiSingleResponseSchema(userResourceSchema);
const usersCollectionResponseSchema =
  createJsonApiCollectionResponseSchema(userResourceSchema);

// Create registry and register schemas
export const usersRegistry = new OpenAPIRegistry();
usersRegistry.register("User", userSelectSchema);
usersRegistry.register("CreateUser", userInsertSchema);
usersRegistry.register("UserResource", userResourceSchema);
usersRegistry.register("UserSingleResponse", userSingleResponseSchema);
usersRegistry.register(
  "UsersCollectionResponse",
  usersCollectionResponseSchema,
);

// 1. GET /v1/users/me (Get Current User)
usersRegistry.registerPath({
  method: "get",
  path: "/v1/users/me",
  summary: "Get current authenticated user's information",
  tags: ["Users v1"],
  security: [{ bearerAuth: [] }],
  responses: {
    [HttpStatus.SUCCESS.statusCode]: {
      description: HttpStatus.SUCCESS.description,
      content: {
        "application/json": {
          schema: userSingleResponseSchema,
        },
      },
    },
    [HttpStatus.UNAUTHORIZED.statusCode]: {
      description: HttpStatus.UNAUTHORIZED.description,
      content: {
        "application/json": {
          schema: ErrorResponseRef,
        },
      },
    },
    [HttpStatus.INTERNAL_SERVER_ERROR.statusCode]: {
      description: HttpStatus.INTERNAL_SERVER_ERROR.description,
      content: {
        "application/json": {
          schema: ErrorResponseRef,
        },
      },
    },
  },
});

// 2. GET /v1/users (Get All Users)
usersRegistry.registerPath({
  method: "get",
  path: "/v1/users",
  summary: "Get all users",
  description:
    "Returns a paginated list of users with filtering and sorting options",
  tags: ["Users v1"],
  security: [{ bearerAuth: [] }],
  responses: {
    [HttpStatus.SUCCESS.statusCode]: {
      description: HttpStatus.SUCCESS.description,
      content: {
        "application/json": {
          schema: usersCollectionResponseSchema,
        },
      },
    },
    [HttpStatus.UNAUTHORIZED.statusCode]: {
      description: HttpStatus.UNAUTHORIZED.description,
      content: {
        "application/json": {
          schema: ErrorResponseRef,
        },
      },
    },
    [HttpStatus.FORBIDDEN.statusCode]: {
      description: "Forbidden - Admin access required",
      content: {
        "application/json": {
          schema: ErrorResponseRef,
        },
      },
    },
  },
});

// 3. GET /v1/users/{id} (Get User by ID)
usersRegistry.registerPath({
  method: "get",
  path: "/v1/users/{id}",
  summary: "Get user by ID",
  description:
    "Retrieve user details by user ID. Users can only view their own profile unless they are admins.",
  tags: ["Users v1"],
  security: [{ bearerAuth: [] }],
  responses: {
    [HttpStatus.SUCCESS.statusCode]: {
      description: HttpStatus.SUCCESS.description,
      content: {
        "application/json": {
          schema: userSingleResponseSchema,
        },
      },
    },
    [HttpStatus.UNAUTHORIZED.statusCode]: {
      description: HttpStatus.UNAUTHORIZED.description,
      content: {
        "application/json": {
          schema: ErrorResponseRef,
        },
      },
    },
    [HttpStatus.FORBIDDEN.statusCode]: {
      description: "Forbidden - Not authorized to view this user",
      content: {
        "application/json": {
          schema: ErrorResponseRef,
        },
      },
    },
    [HttpStatus.NOT_FOUND.statusCode]: {
      description: HttpStatus.NOT_FOUND.description,
      content: {
        "application/json": {
          schema: ErrorResponseRef,
        },
      },
    },
  },
});

// 4. POST /v1/users (Create a new user)
usersRegistry.registerPath({
  method: "post",
  path: "/v1/users",
  summary: "Create a new user",
  description:
    "Register a new user account. Can be used for both anonymous and registered users.",
  tags: ["Users v1"],
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      required: true,
      content: {
        "application/json": {
          schema: userInsertSchema,
        },
      },
    },
  },
  responses: {
    [HttpStatus.CREATED.statusCode]: {
      description: HttpStatus.CREATED.description,
      content: {
        "application/json": {
          schema: userSingleResponseSchema,
        },
      },
    },
    [HttpStatus.BAD_REQUEST.statusCode]: {
      description: HttpStatus.BAD_REQUEST.description,
      content: {
        "application/json": {
          schema: ErrorResponseRef,
        },
      },
    },
    [HttpStatus.UNAUTHORIZED.statusCode]: {
      description: HttpStatus.UNAUTHORIZED.description,
      content: {
        "application/json": {
          schema: ErrorResponseRef,
        },
      },
    },
    [HttpStatus.CONFLICT.statusCode]: {
      description: "Email already in use",
      content: {
        "application/json": {
          schema: ErrorResponseRef,
        },
      },
    },
  },
});
