import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

const postAuthv1register_Body = z
  .object({
    email: z.string().max(255).nullable(),
    password: z.string().max(255).nullable(),
    name: z.string().max(255).nullable(),
  })
  .passthrough();
const JsonApiErrorResponse = z
  .object({ errors: z.array(z.object({}).partial().passthrough()) })
  .passthrough();
const postAuthv1login_Body = z
  .object({
    email: z.string().max(255).nullable(),
    password: z.string().max(255).nullable(),
  })
  .passthrough();
const postV1chats_Body = z
  .object({
    message: z.string().min(1).max(10000),
    metadata: z.record(z.unknown().nullable()).optional(),
  })
  .passthrough();
const postV1documents_Body = z
  .object({
    id: z.string().uuid().optional(),
    title: z.string(),
    description: z.string(),
    type: z.string(),
    sections: z.number().int().gte(-2147483648).lte(2147483647),
    lastUpdated: z.string().max(4),
    storageUrl: z.string(),
    downloadCount: z.number().int().gte(-2147483648).lte(2147483647).optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
  })
  .passthrough();
const postV1lawyers_Body = z
  .object({
    id: z.string().uuid().optional(),
    name: z.string().max(255),
    email: z.string().max(255),
    specialization: z.string().max(100),
    experienceYears: z.number().int().gte(-2147483648).lte(2147483647),
    rating: z.string().max(10).nullish(),
    casesHandled: z.number().int().gte(-2147483648).lte(2147483647).optional(),
    isAvailable: z.boolean().optional(),
    location: z.string().max(100),
    languages: z.array(z.string()),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
  })
  .passthrough();
const putV1lawyersId_Body = z
  .object({
    id: z.string().uuid(),
    name: z.string().max(255),
    email: z.string().max(255),
    specialization: z.string().max(100),
    experienceYears: z.number().int().gte(-2147483648).lte(2147483647),
    rating: z.string().max(10).nullable(),
    casesHandled: z.number().int().gte(-2147483648).lte(2147483647),
    isAvailable: z.boolean(),
    location: z.string().max(100),
    languages: z.array(z.string()),
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .partial()
  .passthrough();
const postV1messages_Body = z
  .object({
    chatId: z.string().uuid(),
    content: z.string().min(1),
    senderType: z.enum(["user", "assistant", "system"]),
    userId: z.string().uuid().nullable(),
  })
  .passthrough();
const putV1notificationspreferencesupdate_Body = z
  .object({
    userId: z.string().uuid(),
    emailEnabled: z.boolean().optional(),
    pushEnabled: z.boolean().optional(),
    inAppEnabled: z.boolean().optional(),
    updatedAt: z.string().optional(),
  })
  .passthrough();
const postV1users_Body = z
  .object({
    id: z.string().uuid(),
    name: z.string().max(255).nullable(),
    email: z.string().max(255).nullable(),
    password: z.string().max(255).nullable(),
    role: z.enum(["user", "admin", "lawyer"]),
    fingerprint: z.string().max(255).nullable(),
    userAgent: z.string().nullable(),
    lastIp: z.string().max(45).nullable(),
    isAnonymous: z.boolean(),
    age: z.number().int().gte(-2147483648).lte(2147483647).nullable(),
    gender: z
      .enum(["male", "female", "non_binary", "prefer_not_to_say", "other"])
      .nullable(),
    country: z.string().max(100).nullable(),
    city: z.string().max(100).nullable(),
    phoneNumber: z.string().max(20).nullable(),
    occupation: z.string().max(100).nullable(),
    bio: z.string().nullable(),
    profilePicture: z.string().nullable(),
    isOnboarded: z.boolean(),
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .partial()
  .passthrough();

export const schemas = {
  postAuthv1register_Body,
  JsonApiErrorResponse,
  postAuthv1login_Body,
  postV1chats_Body,
  postV1documents_Body,
  postV1lawyers_Body,
  putV1lawyersId_Body,
  postV1messages_Body,
  putV1notificationspreferencesupdate_Body,
  postV1users_Body,
};

const endpoints = makeApi([
  {
    method: "post",
    path: "/auth/v1/login",
    alias: "postAuthv1login",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: postAuthv1login_Body,
      },
    ],
    response: z
      .object({
        email: z.string().max(255).nullable(),
        password: z.string().max(255).nullable(),
      })
      .passthrough(),
    errors: [
      {
        status: 400,
        description: `The request could not be understood or was missing required parameters.`,
        schema: JsonApiErrorResponse,
      },
      {
        status: 401,
        description: `Authentication failed or user doesn&#x27;t have permissions for the requested operation.`,
        schema: JsonApiErrorResponse,
      },
    ],
  },
  {
    method: "post",
    path: "/auth/v1/register",
    alias: "postAuthv1register",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: postAuthv1register_Body,
      },
    ],
    response: z
      .object({
        email: z.string().max(255).nullable(),
        password: z.string().max(255).nullable(),
        name: z.string().max(255).nullable(),
      })
      .passthrough(),
    errors: [
      {
        status: 400,
        description: `The request could not be understood or was missing required parameters.`,
        schema: JsonApiErrorResponse,
      },
      {
        status: 409,
        description: `User already exists`,
        schema: JsonApiErrorResponse,
      },
    ],
  },
  {
    method: "post",
    path: "/v1/chats",
    alias: "postV1chats",
    description: `Creates a new chat session with an optional initial message`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: postV1chats_Body,
      },
    ],
    response: z
      .object({
        data: z
          .object({
            type: z.literal("chat"),
            id: z.string().uuid(),
            attributes: z
              .object({
                id: z.string().uuid(),
                userId: z.string().uuid(),
                title: z.string().nullable(),
                metadata: z.union([
                  z.string(),
                  z.number(),
                  z.boolean(),
                  z.unknown(),
                  z.record(z.unknown().nullable()),
                  z.array(z.unknown().nullable()),
                  z.unknown(),
                ]),
                createdAt: z.string(),
                updatedAt: z.string(),
              })
              .passthrough(),
            relationships: z.record(z.unknown().nullable()).optional(),
            meta: z.record(z.unknown().nullable()).optional(),
            links: z.record(z.string()).optional(),
          })
          .passthrough(),
        links: z.object({ self: z.string() }).passthrough(),
        metadata: z.record(z.unknown().nullable()),
      })
      .passthrough(),
    errors: [
      {
        status: 400,
        description: `The request could not be understood or was missing required parameters.`,
        schema: JsonApiErrorResponse,
      },
      {
        status: 401,
        description: `Authentication failed or user doesn&#x27;t have permissions for the requested operation.`,
        schema: JsonApiErrorResponse,
      },
      {
        status: 500,
        description: `An unexpected condition was encountered and no more specific message is suitable.`,
        schema: JsonApiErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/v1/chats",
    alias: "getV1chats",
    description: `Returns a list of chats for the authenticated user`,
    requestFormat: "json",
    response: z
      .object({
        data: z.array(
          z
            .object({
              type: z.literal("chat"),
              id: z.string().uuid(),
              attributes: z
                .object({
                  id: z.string().uuid(),
                  userId: z.string().uuid(),
                  title: z.string().nullable(),
                  metadata: z.union([
                    z.string(),
                    z.number(),
                    z.boolean(),
                    z.unknown(),
                    z.record(z.unknown().nullable()),
                    z.array(z.unknown().nullable()),
                    z.unknown(),
                  ]),
                  createdAt: z.string(),
                  updatedAt: z.string(),
                })
                .passthrough(),
              relationships: z.record(z.unknown().nullable()).optional(),
              meta: z.record(z.unknown().nullable()).optional(),
              links: z.record(z.string()).optional(),
            })
            .passthrough()
        ),
        links: z.object({ self: z.string() }).passthrough(),
        metadata: z.record(z.unknown().nullable()),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Authentication failed or user doesn&#x27;t have permissions for the requested operation.`,
        schema: JsonApiErrorResponse,
      },
      {
        status: 500,
        description: `An unexpected condition was encountered and no more specific message is suitable.`,
        schema: JsonApiErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/v1/chats/:chatId",
    alias: "getV1chatsChatId",
    description: `Returns a specific chat by its ID`,
    requestFormat: "json",
    parameters: [
      {
        name: "chatId",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z
      .object({
        data: z
          .object({
            type: z.literal("chat"),
            id: z.string().uuid(),
            attributes: z
              .object({
                id: z.string().uuid(),
                userId: z.string().uuid(),
                title: z.string().nullable(),
                metadata: z.union([
                  z.string(),
                  z.number(),
                  z.boolean(),
                  z.unknown(),
                  z.record(z.unknown().nullable()),
                  z.array(z.unknown().nullable()),
                  z.unknown(),
                ]),
                createdAt: z.string(),
                updatedAt: z.string(),
              })
              .passthrough(),
            relationships: z.record(z.unknown().nullable()).optional(),
            meta: z.record(z.unknown().nullable()).optional(),
            links: z.record(z.string()).optional(),
          })
          .passthrough(),
        links: z.object({ self: z.string() }).passthrough(),
        metadata: z.record(z.unknown().nullable()),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Authentication failed or user doesn&#x27;t have permissions for the requested operation.`,
        schema: JsonApiErrorResponse,
      },
      {
        status: 404,
        description: `The requested resource could not be found on the server.`,
        schema: JsonApiErrorResponse,
      },
      {
        status: 500,
        description: `An unexpected condition was encountered and no more specific message is suitable.`,
        schema: JsonApiErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/v1/chats/:chatId/messages",
    alias: "getV1chatsChatIdmessages",
    description: `Retrieve messages for a specific chat`,
    requestFormat: "json",
    parameters: [
      {
        name: "chatId",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z
      .object({
        data: z.array(
          z
            .object({
              type: z.literal("message"),
              id: z.string().uuid(),
              attributes: z
                .object({
                  id: z.string().uuid(),
                  userId: z.string().uuid(),
                  title: z.string().nullable(),
                  metadata: z.union([
                    z.string(),
                    z.number(),
                    z.boolean(),
                    z.unknown(),
                    z.record(z.unknown().nullable()),
                    z.array(z.unknown().nullable()),
                    z.unknown(),
                  ]),
                  createdAt: z.string(),
                  updatedAt: z.string(),
                })
                .passthrough(),
              relationships: z.record(z.unknown().nullable()).optional(),
              meta: z.record(z.unknown().nullable()).optional(),
              links: z.record(z.string()).optional(),
            })
            .passthrough()
        ),
        links: z.object({ self: z.string() }).passthrough(),
        metadata: z.record(z.unknown().nullable()),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Authentication failed or user doesn&#x27;t have permissions for the requested operation.`,
        schema: JsonApiErrorResponse,
      },
      {
        status: 404,
        description: `The requested resource could not be found on the server.`,
        schema: JsonApiErrorResponse,
      },
      {
        status: 500,
        description: `An unexpected condition was encountered and no more specific message is suitable.`,
        schema: JsonApiErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/v1/documents",
    alias: "getV1documents",
    description: `Returns a list of all documents with optional filtering and pagination`,
    requestFormat: "json",
    parameters: [
      {
        name: "type",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "limit",
        type: "Query",
        schema: z.number().int().optional().default(10),
      },
      {
        name: "offset",
        type: "Query",
        schema: z.number().int().optional().default(0),
      },
    ],
    response: z
      .object({
        data: z.array(
          z
            .object({
              type: z.literal("document"),
              id: z.string().uuid(),
              attributes: z
                .object({
                  id: z.string().uuid(),
                  title: z.string(),
                  description: z.string(),
                  type: z.string(),
                  sections: z.number().int().gte(-2147483648).lte(2147483647),
                  lastUpdated: z.string().max(4),
                  storageUrl: z.string(),
                  downloadCount: z
                    .number()
                    .int()
                    .gte(-2147483648)
                    .lte(2147483647),
                  createdAt: z.string(),
                  updatedAt: z.string(),
                })
                .passthrough(),
              relationships: z.record(z.unknown().nullable()).optional(),
              meta: z.record(z.unknown().nullable()).optional(),
              links: z.record(z.string()).optional(),
            })
            .passthrough()
        ),
        links: z.object({ self: z.string() }).passthrough(),
        metadata: z.record(z.unknown().nullable()),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Authentication failed or user doesn&#x27;t have permissions for the requested operation.`,
        schema: JsonApiErrorResponse,
      },
      {
        status: 500,
        description: `An unexpected condition was encountered and no more specific message is suitable.`,
        schema: JsonApiErrorResponse,
      },
    ],
  },
  {
    method: "post",
    path: "/v1/documents",
    alias: "postV1documents",
    description: `Register a new document in the system`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: postV1documents_Body,
      },
    ],
    response: z
      .object({
        data: z
          .object({
            type: z.literal("document"),
            id: z.string().uuid(),
            attributes: z
              .object({
                id: z.string().uuid(),
                title: z.string(),
                description: z.string(),
                type: z.string(),
                sections: z.number().int().gte(-2147483648).lte(2147483647),
                lastUpdated: z.string().max(4),
                storageUrl: z.string(),
                downloadCount: z
                  .number()
                  .int()
                  .gte(-2147483648)
                  .lte(2147483647),
                createdAt: z.string(),
                updatedAt: z.string(),
              })
              .passthrough(),
            relationships: z.record(z.unknown().nullable()).optional(),
            meta: z.record(z.unknown().nullable()).optional(),
            links: z.record(z.string()).optional(),
          })
          .passthrough(),
        links: z.object({ self: z.string() }).passthrough(),
        metadata: z.record(z.unknown().nullable()),
      })
      .passthrough(),
    errors: [
      {
        status: 400,
        description: `The request could not be understood or was missing required parameters.`,
        schema: JsonApiErrorResponse,
      },
      {
        status: 401,
        description: `Authentication failed or user doesn&#x27;t have permissions for the requested operation.`,
        schema: JsonApiErrorResponse,
      },
      {
        status: 500,
        description: `An unexpected condition was encountered and no more specific message is suitable.`,
        schema: JsonApiErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/v1/documents/:id",
    alias: "getV1documentsId",
    description: `Retrieve document details by document ID`,
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z
      .object({
        data: z
          .object({
            type: z.literal("document"),
            id: z.string().uuid(),
            attributes: z
              .object({
                id: z.string().uuid(),
                title: z.string(),
                description: z.string(),
                type: z.string(),
                sections: z.number().int().gte(-2147483648).lte(2147483647),
                lastUpdated: z.string().max(4),
                storageUrl: z.string(),
                downloadCount: z
                  .number()
                  .int()
                  .gte(-2147483648)
                  .lte(2147483647),
                createdAt: z.string(),
                updatedAt: z.string(),
              })
              .passthrough(),
            relationships: z.record(z.unknown().nullable()).optional(),
            meta: z.record(z.unknown().nullable()).optional(),
            links: z.record(z.string()).optional(),
          })
          .passthrough(),
        links: z.object({ self: z.string() }).passthrough(),
        metadata: z.record(z.unknown().nullable()),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Authentication failed or user doesn&#x27;t have permissions for the requested operation.`,
        schema: JsonApiErrorResponse,
      },
      {
        status: 404,
        description: `The requested resource could not be found on the server.`,
        schema: JsonApiErrorResponse,
      },
      {
        status: 500,
        description: `An unexpected condition was encountered and no more specific message is suitable.`,
        schema: JsonApiErrorResponse,
      },
    ],
  },
  {
    method: "post",
    path: "/v1/documents/:id/bookmark",
    alias: "postV1documentsIdbookmark",
    description: `Add or remove a bookmark for a document`,
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z
      .object({
        data: z
          .object({
            type: z.literal("document"),
            id: z.string().uuid(),
            attributes: z
              .object({
                id: z.string().uuid(),
                title: z.string(),
                description: z.string(),
                type: z.string(),
                sections: z.number().int().gte(-2147483648).lte(2147483647),
                lastUpdated: z.string().max(4),
                storageUrl: z.string(),
                downloadCount: z
                  .number()
                  .int()
                  .gte(-2147483648)
                  .lte(2147483647),
                createdAt: z.string(),
                updatedAt: z.string(),
              })
              .passthrough(),
            relationships: z.record(z.unknown().nullable()).optional(),
            meta: z.record(z.unknown().nullable()).optional(),
            links: z.record(z.string()).optional(),
          })
          .passthrough(),
        links: z.object({ self: z.string() }).passthrough(),
        metadata: z.record(z.unknown().nullable()),
      })
      .passthrough(),
    errors: [
      {
        status: 400,
        description: `The request could not be understood or was missing required parameters.`,
        schema: JsonApiErrorResponse,
      },
      {
        status: 401,
        description: `Authentication failed or user doesn&#x27;t have permissions for the requested operation.`,
        schema: JsonApiErrorResponse,
      },
      {
        status: 404,
        description: `The requested resource could not be found on the server.`,
        schema: JsonApiErrorResponse,
      },
      {
        status: 500,
        description: `An unexpected condition was encountered and no more specific message is suitable.`,
        schema: JsonApiErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/v1/documents/:id/download",
    alias: "getV1documentsIddownload",
    description: `Increment download count and return document details`,
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z
      .object({
        data: z
          .object({
            type: z.literal("document"),
            id: z.string().uuid(),
            attributes: z
              .object({
                id: z.string().uuid(),
                title: z.string(),
                description: z.string(),
                type: z.string(),
                sections: z.number().int().gte(-2147483648).lte(2147483647),
                lastUpdated: z.string().max(4),
                storageUrl: z.string(),
                downloadCount: z
                  .number()
                  .int()
                  .gte(-2147483648)
                  .lte(2147483647),
                createdAt: z.string(),
                updatedAt: z.string(),
              })
              .passthrough(),
            relationships: z.record(z.unknown().nullable()).optional(),
            meta: z.record(z.unknown().nullable()).optional(),
            links: z.record(z.string()).optional(),
          })
          .passthrough(),
        links: z.object({ self: z.string() }).passthrough(),
        metadata: z.record(z.unknown().nullable()),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Authentication failed or user doesn&#x27;t have permissions for the requested operation.`,
        schema: JsonApiErrorResponse,
      },
      {
        status: 404,
        description: `The requested resource could not be found on the server.`,
        schema: JsonApiErrorResponse,
      },
      {
        status: 500,
        description: `An unexpected condition was encountered and no more specific message is suitable.`,
        schema: JsonApiErrorResponse,
      },
    ],
  },
  {
    method: "post",
    path: "/v1/documents/ingest",
    alias: "postV1documentsingest",
    description: `Upload and process a document with real-time progress updates via Server-Sent Events`,
    requestFormat: "form-data",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ file: z.instanceof(File) }).passthrough(),
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 400,
        description: `The request could not be understood or was missing required parameters.`,
        schema: JsonApiErrorResponse,
      },
      {
        status: 401,
        description: `Authentication failed or user doesn&#x27;t have permissions for the requested operation.`,
        schema: JsonApiErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/v1/inference/preferences/:userId",
    alias: "getV1inferencepreferencesUserId",
    description: `Retrieve all inference preferences for a specific user`,
    requestFormat: "json",
    parameters: [
      {
        name: "userId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: z
      .object({
        data: z.array(
          z
            .object({
              type: z.literal("inferencePreference"),
              id: z.string().uuid(),
              attributes: z
                .object({
                  id: z.string().uuid(),
                  userId: z.string().uuid(),
                  strategyKey: z.string(),
                  provider: z.enum(["gemini", "ollama", "claude"]),
                  model: z.string().nullable(),
                  createdAt: z.string(),
                  updatedAt: z.string(),
                })
                .passthrough(),
              relationships: z.record(z.unknown().nullable()).optional(),
              meta: z.record(z.unknown().nullable()).optional(),
              links: z.record(z.string()).optional(),
            })
            .passthrough()
        ),
        links: z.object({ self: z.string() }).passthrough(),
        metadata: z.record(z.unknown().nullable()),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Authentication failed or user doesn&#x27;t have permissions for the requested operation.`,
        schema: JsonApiErrorResponse,
      },
      {
        status: 404,
        description: `The requested resource could not be found on the server.`,
        schema: JsonApiErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/v1/inference/preferences/:userId/:strategyKey",
    alias: "getV1inferencepreferencesUserIdStrategyKey",
    description: `Retrieve a specific inference preference for a user and strategy`,
    requestFormat: "json",
    parameters: [
      {
        name: "userId",
        type: "Path",
        schema: z.string().uuid(),
      },
      {
        name: "strategyKey",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z
      .object({
        data: z
          .object({
            type: z.literal("inferencePreference"),
            id: z.string().uuid(),
            attributes: z
              .object({
                id: z.string().uuid(),
                userId: z.string().uuid(),
                strategyKey: z.string(),
                provider: z.enum(["gemini", "ollama", "claude"]),
                model: z.string().nullable(),
                createdAt: z.string(),
                updatedAt: z.string(),
              })
              .passthrough(),
            relationships: z.record(z.unknown().nullable()).optional(),
            meta: z.record(z.unknown().nullable()).optional(),
            links: z.record(z.string()).optional(),
          })
          .passthrough(),
        links: z.object({ self: z.string() }).passthrough(),
        metadata: z.record(z.unknown().nullable()),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Authentication failed or user doesn&#x27;t have permissions for the requested operation.`,
        schema: JsonApiErrorResponse,
      },
      {
        status: 404,
        description: `No preference found for this strategy`,
        schema: JsonApiErrorResponse,
      },
    ],
  },
  {
    method: "put",
    path: "/v1/inference/preferences/:userId/:strategyKey",
    alias: "putV1inferencepreferencesUserIdStrategyKey",
    description: `Disables a specific inference preference, resetting to strategy default`,
    requestFormat: "json",
    parameters: [
      {
        name: "userId",
        type: "Path",
        schema: z.string().uuid(),
      },
      {
        name: "strategyKey",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z
      .object({
        data: z.object({ data: z.unknown().nullable() }).passthrough(),
        links: z.object({ self: z.string() }).passthrough(),
        metadata: z.record(z.unknown().nullable()),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Authentication failed or user doesn&#x27;t have permissions for the requested operation.`,
        schema: JsonApiErrorResponse,
      },
      {
        status: 404,
        description: `No preference found for this strategy`,
        schema: JsonApiErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/v1/inference/providers",
    alias: "getV1inferenceproviders",
    description: `Retrieve all registered LLM providers and their default models`,
    requestFormat: "json",
    response: z
      .object({
        data: z.array(
          z
            .object({
              type: z.literal("provider"),
              id: z.string().uuid(),
              attributes: z
                .object({
                  name: z.enum(["gemini", "ollama", "claude"]),
                  defaultModel: z.string(),
                })
                .passthrough(),
              relationships: z.record(z.unknown().nullable()).optional(),
              meta: z.record(z.unknown().nullable()).optional(),
              links: z.record(z.string()).optional(),
            })
            .passthrough()
        ),
        links: z.object({ self: z.string() }).passthrough(),
        metadata: z.record(z.unknown().nullable()),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Authentication failed or user doesn&#x27;t have permissions for the requested operation.`,
        schema: JsonApiErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/v1/inference/strategies",
    alias: "getV1inferencestrategies",
    description: `Retrieve all registered inference strategy keys that can be configured`,
    requestFormat: "json",
    response: z
      .object({
        data: z.array(
          z
            .object({
              type: z.literal("strategy"),
              id: z.string().uuid(),
              attributes: z.object({ key: z.string() }).passthrough(),
              relationships: z.record(z.unknown().nullable()).optional(),
              meta: z.record(z.unknown().nullable()).optional(),
              links: z.record(z.string()).optional(),
            })
            .passthrough()
        ),
        links: z.object({ self: z.string() }).passthrough(),
        metadata: z.record(z.unknown().nullable()),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Authentication failed or user doesn&#x27;t have permissions for the requested operation.`,
        schema: JsonApiErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/v1/lawyers",
    alias: "getV1lawyers",
    description: `Returns a list of all registered lawyers with optional filtering and pagination`,
    requestFormat: "json",
    response: z
      .object({
        data: z.array(
          z
            .object({
              type: z.literal("lawyer"),
              id: z.string().uuid(),
              attributes: z
                .object({
                  id: z.string().uuid(),
                  name: z.string().max(255),
                  email: z.string().max(255),
                  specialization: z.string().max(100),
                  experienceYears: z
                    .number()
                    .int()
                    .gte(-2147483648)
                    .lte(2147483647),
                  rating: z.string().max(10).nullable(),
                  casesHandled: z
                    .number()
                    .int()
                    .gte(-2147483648)
                    .lte(2147483647),
                  isAvailable: z.boolean(),
                  location: z.string().max(100),
                  languages: z.array(z.string()),
                  createdAt: z.string(),
                  updatedAt: z.string(),
                })
                .passthrough(),
              relationships: z.record(z.unknown().nullable()).optional(),
              meta: z.record(z.unknown().nullable()).optional(),
              links: z.record(z.string()).optional(),
            })
            .passthrough()
        ),
        links: z.object({ self: z.string() }).passthrough(),
        metadata: z.record(z.unknown().nullable()),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Authentication failed or user doesn&#x27;t have permissions for the requested operation.`,
        schema: JsonApiErrorResponse,
      },
      {
        status: 500,
        description: `An unexpected condition was encountered and no more specific message is suitable.`,
        schema: JsonApiErrorResponse,
      },
    ],
  },
  {
    method: "post",
    path: "/v1/lawyers",
    alias: "postV1lawyers",
    description: `Register a new lawyer in the system`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: postV1lawyers_Body,
      },
    ],
    response: z
      .object({
        data: z
          .object({
            type: z.literal("lawyer"),
            id: z.string().uuid(),
            attributes: z
              .object({
                id: z.string().uuid(),
                name: z.string().max(255),
                email: z.string().max(255),
                specialization: z.string().max(100),
                experienceYears: z
                  .number()
                  .int()
                  .gte(-2147483648)
                  .lte(2147483647),
                rating: z.string().max(10).nullable(),
                casesHandled: z.number().int().gte(-2147483648).lte(2147483647),
                isAvailable: z.boolean(),
                location: z.string().max(100),
                languages: z.array(z.string()),
                createdAt: z.string(),
                updatedAt: z.string(),
              })
              .passthrough(),
            relationships: z.record(z.unknown().nullable()).optional(),
            meta: z.record(z.unknown().nullable()).optional(),
            links: z.record(z.string()).optional(),
          })
          .passthrough(),
        links: z.object({ self: z.string() }).passthrough(),
        metadata: z.record(z.unknown().nullable()),
      })
      .passthrough(),
    errors: [
      {
        status: 400,
        description: `The request could not be understood or was missing required parameters.`,
        schema: JsonApiErrorResponse,
      },
      {
        status: 401,
        description: `Authentication failed or user doesn&#x27;t have permissions for the requested operation.`,
        schema: JsonApiErrorResponse,
      },
      {
        status: 409,
        description: `Lawyer with this email already exists`,
        schema: JsonApiErrorResponse,
      },
      {
        status: 500,
        description: `An unexpected condition was encountered and no more specific message is suitable.`,
        schema: JsonApiErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/v1/lawyers/:id",
    alias: "getV1lawyersId",
    description: `Retrieve lawyer details by lawyer ID`,
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z
      .object({
        data: z
          .object({
            type: z.literal("lawyer"),
            id: z.string().uuid(),
            attributes: z
              .object({
                id: z.string().uuid(),
                name: z.string().max(255),
                email: z.string().max(255),
                specialization: z.string().max(100),
                experienceYears: z
                  .number()
                  .int()
                  .gte(-2147483648)
                  .lte(2147483647),
                rating: z.string().max(10).nullable(),
                casesHandled: z.number().int().gte(-2147483648).lte(2147483647),
                isAvailable: z.boolean(),
                location: z.string().max(100),
                languages: z.array(z.string()),
                createdAt: z.string(),
                updatedAt: z.string(),
              })
              .passthrough(),
            relationships: z.record(z.unknown().nullable()).optional(),
            meta: z.record(z.unknown().nullable()).optional(),
            links: z.record(z.string()).optional(),
          })
          .passthrough(),
        links: z.object({ self: z.string() }).passthrough(),
        metadata: z.record(z.unknown().nullable()),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Authentication failed or user doesn&#x27;t have permissions for the requested operation.`,
        schema: JsonApiErrorResponse,
      },
      {
        status: 404,
        description: `The requested resource could not be found on the server.`,
        schema: JsonApiErrorResponse,
      },
      {
        status: 500,
        description: `An unexpected condition was encountered and no more specific message is suitable.`,
        schema: JsonApiErrorResponse,
      },
    ],
  },
  {
    method: "put",
    path: "/v1/lawyers/:id",
    alias: "putV1lawyersId",
    description: `Update an existing lawyer&#x27;s information`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: putV1lawyersId_Body,
      },
      {
        name: "id",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z
      .object({
        data: z
          .object({
            type: z.literal("lawyer"),
            id: z.string().uuid(),
            attributes: z
              .object({
                id: z.string().uuid(),
                name: z.string().max(255),
                email: z.string().max(255),
                specialization: z.string().max(100),
                experienceYears: z
                  .number()
                  .int()
                  .gte(-2147483648)
                  .lte(2147483647),
                rating: z.string().max(10).nullable(),
                casesHandled: z.number().int().gte(-2147483648).lte(2147483647),
                isAvailable: z.boolean(),
                location: z.string().max(100),
                languages: z.array(z.string()),
                createdAt: z.string(),
                updatedAt: z.string(),
              })
              .passthrough(),
            relationships: z.record(z.unknown().nullable()).optional(),
            meta: z.record(z.unknown().nullable()).optional(),
            links: z.record(z.string()).optional(),
          })
          .passthrough(),
        links: z.object({ self: z.string() }).passthrough(),
        metadata: z.record(z.unknown().nullable()),
      })
      .passthrough(),
    errors: [
      {
        status: 400,
        description: `The request could not be understood or was missing required parameters.`,
        schema: JsonApiErrorResponse,
      },
      {
        status: 401,
        description: `Authentication failed or user doesn&#x27;t have permissions for the requested operation.`,
        schema: JsonApiErrorResponse,
      },
      {
        status: 404,
        description: `The requested resource could not be found on the server.`,
        schema: JsonApiErrorResponse,
      },
      {
        status: 500,
        description: `An unexpected condition was encountered and no more specific message is suitable.`,
        schema: JsonApiErrorResponse,
      },
    ],
  },
  {
    method: "post",
    path: "/v1/messages",
    alias: "postV1messages",
    description: `Send a new message to a chat`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: postV1messages_Body,
      },
    ],
    response: z
      .object({
        data: z
          .object({
            type: z.literal("message"),
            id: z.string().uuid(),
            attributes: z
              .object({
                id: z.string().uuid(),
                chatId: z.string().uuid(),
                content: z.string(),
                senderType: z.enum(["user", "assistant", "system"]),
                userId: z.string().uuid().nullable(),
                timestamp: z.string(),
                metadata: z.union([
                  z.string(),
                  z.number(),
                  z.boolean(),
                  z.unknown(),
                  z.record(z.unknown().nullable()),
                  z.array(z.unknown().nullable()),
                  z.unknown(),
                ]),
              })
              .passthrough(),
            relationships: z.record(z.unknown().nullable()).optional(),
            meta: z.record(z.unknown().nullable()).optional(),
            links: z.record(z.string()).optional(),
          })
          .passthrough(),
        links: z.object({ self: z.string() }).passthrough(),
        metadata: z.record(z.unknown().nullable()),
      })
      .passthrough(),
    errors: [
      {
        status: 400,
        description: `The request could not be understood or was missing required parameters.`,
        schema: JsonApiErrorResponse,
      },
      {
        status: 401,
        description: `Authentication failed or user doesn&#x27;t have permissions for the requested operation.`,
        schema: JsonApiErrorResponse,
      },
      {
        status: 404,
        description: `The requested resource could not be found on the server.`,
        schema: JsonApiErrorResponse,
      },
      {
        status: 500,
        description: `An unexpected condition was encountered and no more specific message is suitable.`,
        schema: JsonApiErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/v1/messages/:chatId",
    alias: "getV1messagesChatId",
    description: `Retrieve all messages for a specific chat`,
    requestFormat: "json",
    parameters: [
      {
        name: "chatId",
        type: "Path",
        schema: z.string(),
      },
      {
        name: "limit",
        type: "Query",
        schema: z.number().int().optional().default(50),
      },
      {
        name: "offset",
        type: "Query",
        schema: z.number().int().optional().default(0),
      },
    ],
    response: z
      .object({
        data: z.array(
          z
            .object({
              type: z.literal("message"),
              id: z.string().uuid(),
              attributes: z
                .object({
                  id: z.string().uuid(),
                  chatId: z.string().uuid(),
                  content: z.string(),
                  senderType: z.enum(["user", "assistant", "system"]),
                  userId: z.string().uuid().nullable(),
                  timestamp: z.string(),
                  metadata: z.union([
                    z.string(),
                    z.number(),
                    z.boolean(),
                    z.unknown(),
                    z.record(z.unknown().nullable()),
                    z.array(z.unknown().nullable()),
                    z.unknown(),
                  ]),
                })
                .passthrough(),
              relationships: z.record(z.unknown().nullable()).optional(),
              meta: z.record(z.unknown().nullable()).optional(),
              links: z.record(z.string()).optional(),
            })
            .passthrough()
        ),
        links: z.object({ self: z.string() }).passthrough(),
        metadata: z.record(z.unknown().nullable()),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Authentication failed or user doesn&#x27;t have permissions for the requested operation.`,
        schema: JsonApiErrorResponse,
      },
      {
        status: 404,
        description: `The requested resource could not be found on the server.`,
        schema: JsonApiErrorResponse,
      },
      {
        status: 500,
        description: `An unexpected condition was encountered and no more specific message is suitable.`,
        schema: JsonApiErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/v1/notifications",
    alias: "getV1notifications",
    description: `Returns a paginated list of notifications for the authenticated user`,
    requestFormat: "json",
    response: z
      .object({
        data: z.array(
          z
            .object({
              type: z.literal("notification"),
              id: z.string().uuid(),
              attributes: z
                .object({
                  id: z.string().uuid(),
                  userId: z.string().uuid(),
                  type: z.string().max(50),
                  channel: z.enum(["in_app", "email", "push"]),
                  title: z.string().max(255),
                  message: z.string(),
                  status: z.enum([
                    "pending",
                    "sent",
                    "delivered",
                    "failed",
                    "read",
                  ]),
                  templateKey: z.string().max(100).nullable(),
                  correlationId: z.string().uuid().nullable(),
                  metadata: z.union([
                    z.string(),
                    z.number(),
                    z.boolean(),
                    z.unknown(),
                    z.record(z.unknown().nullable()),
                    z.array(z.unknown().nullable()),
                    z.unknown(),
                  ]),
                  scheduledAt: z.string(),
                  sentAt: z.string().nullable(),
                  createdAt: z.string(),
                  updatedAt: z.string(),
                })
                .passthrough(),
              relationships: z.record(z.unknown().nullable()).optional(),
              meta: z.record(z.unknown().nullable()).optional(),
              links: z.record(z.string()).optional(),
            })
            .passthrough()
        ),
        links: z.object({ self: z.string() }).passthrough(),
        metadata: z.record(z.unknown().nullable()),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Authentication failed or user doesn&#x27;t have permissions for the requested operation.`,
        schema: JsonApiErrorResponse,
      },
      {
        status: 500,
        description: `An unexpected condition was encountered and no more specific message is suitable.`,
        schema: JsonApiErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/v1/notifications/preferences",
    alias: "getV1notificationspreferences",
    description: `Retrieve notification preferences for the authenticated user`,
    requestFormat: "json",
    response: z
      .object({
        data: z
          .object({
            type: z.literal("notification-preferences"),
            id: z.string().uuid(),
            attributes: z
              .object({
                userId: z.string().uuid(),
                emailEnabled: z.boolean(),
                pushEnabled: z.boolean(),
                inAppEnabled: z.boolean(),
                updatedAt: z.string(),
              })
              .passthrough(),
            relationships: z.record(z.unknown().nullable()).optional(),
            meta: z.record(z.unknown().nullable()).optional(),
            links: z.record(z.string()).optional(),
          })
          .passthrough(),
        links: z.object({ self: z.string() }).passthrough(),
        metadata: z.record(z.unknown().nullable()),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Authentication failed or user doesn&#x27;t have permissions for the requested operation.`,
        schema: JsonApiErrorResponse,
      },
      {
        status: 404,
        description: `The requested resource could not be found on the server.`,
        schema: JsonApiErrorResponse,
      },
    ],
  },
  {
    method: "put",
    path: "/v1/notifications/preferences/update",
    alias: "putV1notificationspreferencesupdate",
    description: `Update notification preferences for the authenticated user`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: putV1notificationspreferencesupdate_Body,
      },
    ],
    response: z
      .object({
        data: z
          .object({
            type: z.literal("notification-preferences"),
            id: z.string().uuid(),
            attributes: z
              .object({
                userId: z.string().uuid(),
                emailEnabled: z.boolean(),
                pushEnabled: z.boolean(),
                inAppEnabled: z.boolean(),
                updatedAt: z.string(),
              })
              .passthrough(),
            relationships: z.record(z.unknown().nullable()).optional(),
            meta: z.record(z.unknown().nullable()).optional(),
            links: z.record(z.string()).optional(),
          })
          .passthrough(),
        links: z.object({ self: z.string() }).passthrough(),
        metadata: z.record(z.unknown().nullable()),
      })
      .passthrough(),
    errors: [
      {
        status: 400,
        description: `The request could not be understood or was missing required parameters.`,
        schema: JsonApiErrorResponse,
      },
      {
        status: 401,
        description: `Authentication failed or user doesn&#x27;t have permissions for the requested operation.`,
        schema: JsonApiErrorResponse,
      },
      {
        status: 404,
        description: `The requested resource could not be found on the server.`,
        schema: JsonApiErrorResponse,
      },
    ],
  },
  {
    method: "post",
    path: "/v1/notifications/set",
    alias: "postV1notificationsset",
    description: `Create default notification preferences for the authenticated user`,
    requestFormat: "json",
    response: z
      .object({
        data: z
          .object({
            type: z.literal("notification-preferences"),
            id: z.string().uuid(),
            attributes: z
              .object({
                userId: z.string().uuid(),
                emailEnabled: z.boolean(),
                pushEnabled: z.boolean(),
                inAppEnabled: z.boolean(),
                updatedAt: z.string(),
              })
              .passthrough(),
            relationships: z.record(z.unknown().nullable()).optional(),
            meta: z.record(z.unknown().nullable()).optional(),
            links: z.record(z.string()).optional(),
          })
          .passthrough(),
        links: z.object({ self: z.string() }).passthrough(),
        metadata: z.record(z.unknown().nullable()),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Authentication failed or user doesn&#x27;t have permissions for the requested operation.`,
        schema: JsonApiErrorResponse,
      },
      {
        status: 404,
        description: `The requested resource could not be found on the server.`,
        schema: JsonApiErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/v1/services",
    alias: "getV1services",
    description: `Returns a list of all available legal services with optional category filtering`,
    requestFormat: "json",
    parameters: [
      {
        name: "category",
        type: "Query",
        schema: z
          .enum([
            "government",
            "legal-aid",
            "dispute-resolution",
            "specialized",
          ])
          .optional(),
      },
    ],
    response: z
      .object({
        data: z.array(
          z
            .object({
              type: z.literal("legal-service"),
              id: z.string().uuid(),
              attributes: z
                .object({
                  id: z.string().uuid(),
                  name: z.string(),
                  categoryId: z.string().nullable(),
                  slug: z.string(),
                  description: z.string().nullable(),
                })
                .passthrough(),
              relationships: z.record(z.unknown().nullable()).optional(),
              meta: z.record(z.unknown().nullable()).optional(),
              links: z.record(z.string()).optional(),
            })
            .passthrough()
        ),
        links: z.object({ self: z.string() }).passthrough(),
        metadata: z.record(z.unknown().nullable()),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Authentication failed or user doesn&#x27;t have permissions for the requested operation.`,
        schema: JsonApiErrorResponse,
      },
      {
        status: 500,
        description: `An unexpected condition was encountered and no more specific message is suitable.`,
        schema: JsonApiErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/v1/users",
    alias: "getV1users",
    description: `Returns a paginated list of users with filtering and sorting options`,
    requestFormat: "json",
    response: z
      .object({
        data: z.array(
          z
            .object({
              type: z.literal("user"),
              id: z.string().uuid(),
              attributes: z
                .object({
                  id: z.string().uuid(),
                  name: z.string().max(255).nullable(),
                  email: z.string().max(255).nullable(),
                  password: z.string().max(255).nullable(),
                  role: z.enum(["user", "admin", "lawyer"]),
                  fingerprint: z.string().max(255).nullable(),
                  userAgent: z.string().nullable(),
                  lastIp: z.string().max(45).nullable(),
                  isAnonymous: z.boolean(),
                  age: z
                    .number()
                    .int()
                    .gte(-2147483648)
                    .lte(2147483647)
                    .nullable(),
                  gender: z
                    .enum([
                      "male",
                      "female",
                      "non_binary",
                      "prefer_not_to_say",
                      "other",
                    ])
                    .nullable(),
                  country: z.string().max(100).nullable(),
                  city: z.string().max(100).nullable(),
                  phoneNumber: z.string().max(20).nullable(),
                  occupation: z.string().max(100).nullable(),
                  bio: z.string().nullable(),
                  profilePicture: z.string().nullable(),
                  isOnboarded: z.boolean(),
                  createdAt: z.string(),
                  updatedAt: z.string(),
                })
                .passthrough(),
              relationships: z.record(z.unknown().nullable()).optional(),
              meta: z.record(z.unknown().nullable()).optional(),
              links: z.record(z.string()).optional(),
            })
            .passthrough()
        ),
        links: z.object({ self: z.string() }).passthrough(),
        metadata: z.record(z.unknown().nullable()),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Authentication failed or user doesn&#x27;t have permissions for the requested operation.`,
        schema: JsonApiErrorResponse,
      },
      {
        status: 403,
        description: `Forbidden - Admin access required`,
        schema: JsonApiErrorResponse,
      },
    ],
  },
  {
    method: "post",
    path: "/v1/users",
    alias: "postV1users",
    description: `Register a new user account. Can be used for both anonymous and registered users.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: postV1users_Body,
      },
    ],
    response: z
      .object({
        data: z
          .object({
            type: z.literal("user"),
            id: z.string().uuid(),
            attributes: z
              .object({
                id: z.string().uuid(),
                name: z.string().max(255).nullable(),
                email: z.string().max(255).nullable(),
                password: z.string().max(255).nullable(),
                role: z.enum(["user", "admin", "lawyer"]),
                fingerprint: z.string().max(255).nullable(),
                userAgent: z.string().nullable(),
                lastIp: z.string().max(45).nullable(),
                isAnonymous: z.boolean(),
                age: z
                  .number()
                  .int()
                  .gte(-2147483648)
                  .lte(2147483647)
                  .nullable(),
                gender: z
                  .enum([
                    "male",
                    "female",
                    "non_binary",
                    "prefer_not_to_say",
                    "other",
                  ])
                  .nullable(),
                country: z.string().max(100).nullable(),
                city: z.string().max(100).nullable(),
                phoneNumber: z.string().max(20).nullable(),
                occupation: z.string().max(100).nullable(),
                bio: z.string().nullable(),
                profilePicture: z.string().nullable(),
                isOnboarded: z.boolean(),
                createdAt: z.string(),
                updatedAt: z.string(),
              })
              .passthrough(),
            relationships: z.record(z.unknown().nullable()).optional(),
            meta: z.record(z.unknown().nullable()).optional(),
            links: z.record(z.string()).optional(),
          })
          .passthrough(),
        links: z.object({ self: z.string() }).passthrough(),
        metadata: z.record(z.unknown().nullable()),
      })
      .passthrough(),
    errors: [
      {
        status: 400,
        description: `The request could not be understood or was missing required parameters.`,
        schema: JsonApiErrorResponse,
      },
      {
        status: 401,
        description: `Authentication failed or user doesn&#x27;t have permissions for the requested operation.`,
        schema: JsonApiErrorResponse,
      },
      {
        status: 409,
        description: `Email already in use`,
        schema: JsonApiErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/v1/users/:id",
    alias: "getV1usersId",
    description: `Retrieve user details by user ID. Users can only view their own profile unless they are admins.`,
    requestFormat: "json",
    response: z
      .object({
        data: z
          .object({
            type: z.literal("user"),
            id: z.string().uuid(),
            attributes: z
              .object({
                id: z.string().uuid(),
                name: z.string().max(255).nullable(),
                email: z.string().max(255).nullable(),
                password: z.string().max(255).nullable(),
                role: z.enum(["user", "admin", "lawyer"]),
                fingerprint: z.string().max(255).nullable(),
                userAgent: z.string().nullable(),
                lastIp: z.string().max(45).nullable(),
                isAnonymous: z.boolean(),
                age: z
                  .number()
                  .int()
                  .gte(-2147483648)
                  .lte(2147483647)
                  .nullable(),
                gender: z
                  .enum([
                    "male",
                    "female",
                    "non_binary",
                    "prefer_not_to_say",
                    "other",
                  ])
                  .nullable(),
                country: z.string().max(100).nullable(),
                city: z.string().max(100).nullable(),
                phoneNumber: z.string().max(20).nullable(),
                occupation: z.string().max(100).nullable(),
                bio: z.string().nullable(),
                profilePicture: z.string().nullable(),
                isOnboarded: z.boolean(),
                createdAt: z.string(),
                updatedAt: z.string(),
              })
              .passthrough(),
            relationships: z.record(z.unknown().nullable()).optional(),
            meta: z.record(z.unknown().nullable()).optional(),
            links: z.record(z.string()).optional(),
          })
          .passthrough(),
        links: z.object({ self: z.string() }).passthrough(),
        metadata: z.record(z.unknown().nullable()),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Authentication failed or user doesn&#x27;t have permissions for the requested operation.`,
        schema: JsonApiErrorResponse,
      },
      {
        status: 403,
        description: `Forbidden - Not authorized to view this user`,
        schema: JsonApiErrorResponse,
      },
      {
        status: 404,
        description: `The requested resource could not be found on the server.`,
        schema: JsonApiErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/v1/users/me",
    alias: "getV1usersme",
    requestFormat: "json",
    response: z
      .object({
        data: z
          .object({
            type: z.literal("user"),
            id: z.string().uuid(),
            attributes: z
              .object({
                id: z.string().uuid(),
                name: z.string().max(255).nullable(),
                email: z.string().max(255).nullable(),
                password: z.string().max(255).nullable(),
                role: z.enum(["user", "admin", "lawyer"]),
                fingerprint: z.string().max(255).nullable(),
                userAgent: z.string().nullable(),
                lastIp: z.string().max(45).nullable(),
                isAnonymous: z.boolean(),
                age: z
                  .number()
                  .int()
                  .gte(-2147483648)
                  .lte(2147483647)
                  .nullable(),
                gender: z
                  .enum([
                    "male",
                    "female",
                    "non_binary",
                    "prefer_not_to_say",
                    "other",
                  ])
                  .nullable(),
                country: z.string().max(100).nullable(),
                city: z.string().max(100).nullable(),
                phoneNumber: z.string().max(20).nullable(),
                occupation: z.string().max(100).nullable(),
                bio: z.string().nullable(),
                profilePicture: z.string().nullable(),
                isOnboarded: z.boolean(),
                createdAt: z.string(),
                updatedAt: z.string(),
              })
              .passthrough(),
            relationships: z.record(z.unknown().nullable()).optional(),
            meta: z.record(z.unknown().nullable()).optional(),
            links: z.record(z.string()).optional(),
          })
          .passthrough(),
        links: z.object({ self: z.string() }).passthrough(),
        metadata: z.record(z.unknown().nullable()),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Authentication failed or user doesn&#x27;t have permissions for the requested operation.`,
        schema: JsonApiErrorResponse,
      },
      {
        status: 500,
        description: `An unexpected condition was encountered and no more specific message is suitable.`,
        schema: JsonApiErrorResponse,
      },
    ],
  },
]);

export const api = new Zodios(endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}
