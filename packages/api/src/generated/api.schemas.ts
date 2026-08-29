import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

const postV1authregister_Body = z
  .object({
    email: z.string().max(255).nullable(),
    password: z.string().max(255).nullable(),
    name: z.string().max(255).nullable(),
  })
  .passthrough();
const JsonApiError = z
  .object({
    id: z.string().uuid(),
    status: z.string(),
    code: z.string(),
    title: z.string(),
    detail: z.string(),
    metadata: z.record(z.unknown().nullable()),
    source: z
      .object({ pointer: z.string(), method: z.string() })
      .partial()
      .passthrough()
      .optional(),
  })
  .passthrough();
const JsonApiErrorResponse = z
  .object({ errors: z.array(JsonApiError) })
  .passthrough();
const postV1authlogin_Body = z
  .object({
    email: z.string().max(255).nullable(),
    password: z.string().max(255).nullable(),
  })
  .passthrough();
const postV1authresetPassword_Body = z
  .object({ password: z.string().min(8), token: z.string() })
  .passthrough();
const postV1chats_Body = z
  .object({
    message: z.string().min(1).max(10000),
    metadata: z.record(z.unknown().nullable()).optional(),
  })
  .passthrough();
const postV1consultations_Body = z
  .object({ lawyerId: z.string().uuid(), requestMessage: z.string().nullish() })
  .passthrough();
const postV1corpus_Body = z
  .object({
    id: z.string().uuid().optional(),
    title: z.string(),
    description: z.string(),
    type: z.string(),
    sections: z.number().int().gte(-2147483648).lte(2147483647),
    lastUpdated: z.string(),
    storageUrl: z.string(),
    downloadCount: z.number().int().gte(-2147483648).lte(2147483647).optional(),
    actName: z.string().nullish(),
    jurisdiction: z.string().nullish(),
    sourceUrl: z.string().nullish(),
    version: z.number().int().gte(-2147483648).lte(2147483647).optional(),
    createdAt: z.string().datetime({ offset: true }).optional(),
    updatedAt: z.string().datetime({ offset: true }).optional(),
  })
  .passthrough();
const postV1lawyers_Body = z
  .object({
    id: z.string().uuid().optional(),
    userId: z.string().uuid(),
    status: z.enum(["draft", "submitted", "approved", "rejected"]).optional(),
    specialization: z.string().max(100).nullish(),
    experienceYears: z
      .number()
      .int()
      .gte(-2147483648)
      .lte(2147483647)
      .nullish(),
    casesHandled: z.number().int().gte(-2147483648).lte(2147483647).optional(),
    isAvailable: z.boolean().optional(),
    location: z.string().max(100).nullish(),
    languages: z.array(z.string()).nullish(),
    bio: z.string().nullish(),
    barNumber: z.string().max(100).nullish(),
    issuingAuthority: z.string().max(255).nullish(),
    jurisdiction: z.string().max(100).nullish(),
    education: z
      .union([
        z.string(),
        z.number(),
        z.boolean(),
        z.unknown(),
        z.record(z.unknown().nullable()),
        z.array(z.unknown().nullable()),
      ])
      .optional(),
    submittedAt: z.string().datetime({ offset: true }).nullish(),
    reviewedBy: z.string().uuid().nullish(),
    reviewedAt: z.string().datetime({ offset: true }).nullish(),
    rejectionReason: z.string().nullish(),
    createdAt: z.string().datetime({ offset: true }).optional(),
    updatedAt: z.string().datetime({ offset: true }).optional(),
  })
  .passthrough();
const putV1lawyersId_Body = z
  .object({
    id: z.string().uuid(),
    userId: z.string().uuid(),
    status: z.enum(["draft", "submitted", "approved", "rejected"]),
    specialization: z.string().max(100).nullable(),
    experienceYears: z
      .number()
      .int()
      .gte(-2147483648)
      .lte(2147483647)
      .nullable(),
    casesHandled: z.number().int().gte(-2147483648).lte(2147483647),
    isAvailable: z.boolean(),
    location: z.string().max(100).nullable(),
    languages: z.array(z.string()).nullable(),
    bio: z.string().nullable(),
    barNumber: z.string().max(100).nullable(),
    issuingAuthority: z.string().max(255).nullable(),
    jurisdiction: z.string().max(100).nullable(),
    education: z.union([
      z.string(),
      z.number(),
      z.boolean(),
      z.unknown(),
      z.record(z.unknown().nullable()),
      z.array(z.unknown().nullable()),
    ]),
    submittedAt: z.string().datetime({ offset: true }).nullable(),
    reviewedBy: z.string().uuid().nullable(),
    reviewedAt: z.string().datetime({ offset: true }).nullable(),
    rejectionReason: z.string().nullable(),
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }),
  })
  .partial()
  .passthrough();
const postV1matters_Body = z
  .object({
    id: z.string().uuid().optional(),
    clientUserId: z.string().uuid(),
    sourceChatId: z.string().uuid().nullish(),
    title: z.string(),
    summary: z.string().nullish(),
    status: z
      .enum([
        "draft",
        "open",
        "waiting_client",
        "waiting_lawyer",
        "in_progress",
        "resolved",
        "closed",
        "archived",
      ])
      .optional(),
    jurisdiction: z.string().max(100).nullish(),
    practiceArea: z.string().max(100).nullish(),
    urgency: z.string().max(50).nullish(),
    metadata: z
      .union([
        z.string(),
        z.number(),
        z.boolean(),
        z.unknown(),
        z.record(z.unknown().nullable()),
        z.array(z.unknown().nullable()),
      ])
      .optional(),
    isSharedWithLawyer: z.boolean().optional(),
    createdAt: z.string().datetime({ offset: true }).optional(),
    updatedAt: z.string().datetime({ offset: true }).optional(),
    closedAt: z.string().datetime({ offset: true }).nullish(),
  })
  .passthrough();
const postV1mattersMatterIdnotes_Body = z
  .object({
    id: z.string().uuid().optional(),
    content: z.string(),
    isInternal: z.boolean().optional(),
    createdAt: z.string().datetime({ offset: true }).optional(),
  })
  .passthrough();
const patchV1mattersMatterId_Body = z
  .object({
    sourceChatId: z.string().uuid().nullable(),
    title: z.string(),
    summary: z.string().nullable(),
    status: z.enum([
      "draft",
      "open",
      "waiting_client",
      "waiting_lawyer",
      "in_progress",
      "resolved",
      "closed",
      "archived",
    ]),
    jurisdiction: z.string().max(100).nullable(),
    practiceArea: z.string().max(100).nullable(),
    urgency: z.string().max(50).nullable(),
    metadata: z.union([
      z.string(),
      z.number(),
      z.boolean(),
      z.unknown(),
      z.record(z.unknown().nullable()),
      z.array(z.unknown().nullable()),
    ]),
    isSharedWithLawyer: z.boolean(),
    updatedAt: z.string().datetime({ offset: true }),
    closedAt: z.string().datetime({ offset: true }).nullable(),
  })
  .partial()
  .passthrough();
const postV1mattersMatterIdlawyers_Body = z
  .object({
    id: z.string().uuid().optional(),
    lawyerId: z.string().uuid(),
    role: z.enum(["primary", "consulting", "referred"]).optional(),
    status: z.string().max(50).nullish(),
    invitedAt: z.string().datetime({ offset: true }).optional(),
    acceptedAt: z.string().datetime({ offset: true }).nullish(),
    notes: z.string().nullish(),
  })
  .passthrough();
const patchV1mattersMatterIdlawyersme_Body = z
  .object({
    lawyerId: z.string().uuid(),
    role: z.enum(["primary", "consulting", "referred"]),
    status: z.string().max(50).nullable(),
    acceptedAt: z.string().datetime({ offset: true }).nullable(),
    notes: z.string().nullable(),
  })
  .partial()
  .passthrough();
const postV1messages_Body = z
  .object({
    chatId: z.string().uuid(),
    content: z.string().min(1),
    senderType: z.enum(["user", "assistant", "system"]),
    userId: z.string().uuid().nullable(),
    metadata: z.record(z.unknown().nullable()).optional(),
  })
  .passthrough();
const postV1users_Body = z
  .object({
    name: z.string().max(255).nullable(),
    email: z.string().max(255).nullable(),
    password: z.string().max(255).nullable(),
    emailVerifiedAt: z.string().datetime({ offset: true }).nullable(),
    fingerprint: z.string().max(255).nullable(),
    userAgent: z.string().nullable(),
    lastIp: z.string().max(45).nullable(),
    isAnonymous: z.boolean(),
    age: z.number().int().gte(-2147483648).lte(2147483647).nullable(),
    gender: z
      .enum([
        "male",
        "female",
        "non_binary",
        "prefer_not_to_say",
        "other",
        null,
      ])
      .nullable(),
    country: z.string().max(100).nullable(),
    city: z.string().max(100).nullable(),
    phoneNumber: z.string().max(20).nullable(),
    occupation: z.string().max(100).nullable(),
    bio: z.string().nullable(),
    profilePicture: z.string().nullable(),
    isFirstLogin: z.boolean(),
    isOnboarded: z.boolean(),
    updatedAt: z.string().datetime({ offset: true }),
  })
  .partial()
  .passthrough();

export const schemas = {
  postV1authregister_Body,
  JsonApiError,
  JsonApiErrorResponse,
  postV1authlogin_Body,
  postV1authresetPassword_Body,
  postV1chats_Body,
  postV1consultations_Body,
  postV1corpus_Body,
  postV1lawyers_Body,
  putV1lawyersId_Body,
  postV1matters_Body,
  postV1mattersMatterIdnotes_Body,
  patchV1mattersMatterId_Body,
  postV1mattersMatterIdlawyers_Body,
  patchV1mattersMatterIdlawyersme_Body,
  postV1messages_Body,
  postV1users_Body,
};

const endpoints = makeApi([
  {
    method: "post",
    path: "/v1/auth/login",
    alias: "postV1authlogin",
    description: `Authenticates an existing user account`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: postV1authlogin_Body,
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
      {
        status: 500,
        description: `An unexpected condition was encountered and no more specific message is suitable.`,
        schema: JsonApiErrorResponse,
      },
    ],
  },
  {
    method: "post",
    path: "/v1/auth/logout",
    alias: "postV1authlogout",
    description: `Revokes the current session and clears auth cookies`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial().passthrough(),
      },
    ],
    response: z.void(),
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
    path: "/v1/auth/me",
    alias: "getV1authme",
    description: `Returns the authenticated user&#x27;s profile`,
    requestFormat: "json",
    response: z.void(),
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
    method: "post",
    path: "/v1/auth/refresh",
    alias: "postV1authrefresh",
    description: `Issues a new access and refresh token pair using the current refresh token cookie`,
    requestFormat: "json",
    response: z.void(),
    errors: [
      {
        status: 401,
        description: `Authentication failed or user doesn&#x27;t have permissions for the requested operation.`,
        schema: JsonApiErrorResponse,
      },
    ],
  },
  {
    method: "post",
    path: "/v1/auth/register",
    alias: "postV1authregister",
    description: `Creates a new user account profile`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: postV1authregister_Body,
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
        description: `The request could not be completed due to a conflict with the current state of the target resource.`,
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
    path: "/v1/auth/request-reset",
    alias: "postV1authrequestReset",
    description: `Sends a password recovery email if an account matches the given address`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ email: z.string().email() }).passthrough(),
      },
    ],
    response: z.object({ email: z.string().email() }).passthrough(),
    errors: [
      {
        status: 400,
        description: `The request could not be understood or was missing required parameters.`,
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
    path: "/v1/auth/resend-verification",
    alias: "postV1authresendVerification",
    description: `Queues a new verification email for the specified user account`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ email: z.string().email() }).passthrough(),
      },
    ],
    response: z.object({ message: z.string() }).passthrough(),
    errors: [
      {
        status: 400,
        description: `The request could not be understood or was missing required parameters.`,
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
    path: "/v1/auth/reset-password",
    alias: "postV1authresetPassword",
    description: `Resets the user&#x27;s password using a valid recovery token`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: postV1authresetPassword_Body,
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
        status: 410,
        description: `The requested resource is no longer available and will not be available again.`,
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
    path: "/v1/auth/verify-email",
    alias: "postV1authverifyEmail",
    description: `Verifies a user&#x27;s email address using a verification token`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ token: z.string() }).passthrough(),
      },
    ],
    response: z.object({ token: z.string() }).passthrough(),
    errors: [
      {
        status: 400,
        description: `The request could not be understood or was missing required parameters.`,
        schema: JsonApiErrorResponse,
      },
      {
        status: 429,
        description: `The user has sent too many requests in a given amount of time.`,
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
                ]),
                createdAt: z.string().datetime({ offset: true }),
                updatedAt: z.string().datetime({ offset: true }),
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
                  ]),
                  createdAt: z.string().datetime({ offset: true }),
                  updatedAt: z.string().datetime({ offset: true }),
                })
                .passthrough(),
              relationships: z.record(z.unknown().nullable()).optional(),
              meta: z.record(z.unknown().nullable()).optional(),
              links: z.record(z.string()).optional(),
            })
            .passthrough()
        ),
        links: z.object({ self: z.string() }).passthrough(),
        metadata: z
          .object({
            requestId: z.string(),
            timestamp: z.string(),
            total: z.number().int().gte(0),
            page: z.number().int().gt(0),
            limit: z.number().int().gt(0),
            totalPages: z.number().int().gte(0),
            availableFilters: z
              .record(z.unknown().nullable())
              .optional()
              .default({}),
            sortOptions: z
              .object({
                fields: z.array(z.string()),
                default: z.string(),
                direction: z.enum(["asc", "desc"]),
              })
              .passthrough(),
          })
          .passthrough(),
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
                ]),
                createdAt: z.string().datetime({ offset: true }),
                updatedAt: z.string().datetime({ offset: true }),
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
    path: "/v1/consultations",
    alias: "getV1consultations",
    description: `Returns a paginated list of consultations with filtering by status, lawyer, or customer.`,
    requestFormat: "json",
    response: z
      .object({
        data: z.array(
          z
            .object({
              type: z.literal("consultation"),
              id: z.string().uuid(),
              attributes: z
                .object({
                  id: z.string().uuid(),
                  customerId: z.string().uuid(),
                  lawyerId: z.string().uuid(),
                  status: z.enum([
                    "pending",
                    "accepted",
                    "declined",
                    "engaged",
                    "closed",
                  ]),
                  requestMessage: z.string().nullable(),
                  respondedAt: z.string().datetime({ offset: true }).nullable(),
                  declineReason: z.string().nullable(),
                  engagedAt: z.string().datetime({ offset: true }).nullable(),
                  closedAt: z.string().datetime({ offset: true }).nullable(),
                  createdAt: z.string().datetime({ offset: true }),
                  updatedAt: z.string().datetime({ offset: true }),
                })
                .passthrough(),
              relationships: z.record(z.unknown().nullable()).optional(),
              meta: z.record(z.unknown().nullable()).optional(),
              links: z.record(z.string()).optional(),
            })
            .passthrough()
        ),
        links: z.object({ self: z.string() }).passthrough(),
        metadata: z
          .object({
            requestId: z.string(),
            timestamp: z.string(),
            total: z.number().int().gte(0),
            page: z.number().int().gt(0),
            limit: z.number().int().gt(0),
            totalPages: z.number().int().gte(0),
            availableFilters: z
              .record(z.unknown().nullable())
              .optional()
              .default({}),
            sortOptions: z
              .object({
                fields: z.array(z.string()),
                default: z.string(),
                direction: z.enum(["asc", "desc"]),
              })
              .passthrough(),
          })
          .passthrough(),
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
    method: "post",
    path: "/v1/consultations",
    alias: "postV1consultations",
    description: `Customer requests a consultation with a lawyer. Creates the consultation in &#x27;pending&#x27; status.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: postV1consultations_Body,
      },
    ],
    response: z
      .object({
        data: z
          .object({
            type: z.literal("consultation"),
            id: z.string().uuid(),
            attributes: z
              .object({
                id: z.string().uuid(),
                customerId: z.string().uuid(),
                lawyerId: z.string().uuid(),
                status: z.enum([
                  "pending",
                  "accepted",
                  "declined",
                  "engaged",
                  "closed",
                ]),
                requestMessage: z.string().nullable(),
                respondedAt: z.string().datetime({ offset: true }).nullable(),
                declineReason: z.string().nullable(),
                engagedAt: z.string().datetime({ offset: true }).nullable(),
                closedAt: z.string().datetime({ offset: true }).nullable(),
                createdAt: z.string().datetime({ offset: true }),
                updatedAt: z.string().datetime({ offset: true }),
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
    ],
  },
  {
    method: "get",
    path: "/v1/consultations/:id",
    alias: "getV1consultationsId",
    description: `Retrieve a single consultation&#x27;s details by ID.`,
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: z
      .object({
        data: z
          .object({
            type: z.literal("consultation"),
            id: z.string().uuid(),
            attributes: z
              .object({
                id: z.string().uuid(),
                customerId: z.string().uuid(),
                lawyerId: z.string().uuid(),
                status: z.enum([
                  "pending",
                  "accepted",
                  "declined",
                  "engaged",
                  "closed",
                ]),
                requestMessage: z.string().nullable(),
                respondedAt: z.string().datetime({ offset: true }).nullable(),
                declineReason: z.string().nullable(),
                engagedAt: z.string().datetime({ offset: true }).nullable(),
                closedAt: z.string().datetime({ offset: true }).nullable(),
                createdAt: z.string().datetime({ offset: true }),
                updatedAt: z.string().datetime({ offset: true }),
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
    method: "patch",
    path: "/v1/consultations/:id/accept",
    alias: "patchV1consultationsIdaccept",
    description: `Lawyer accepts a pending consultation request.`,
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: z
      .object({
        data: z
          .object({
            type: z.literal("consultation"),
            id: z.string().uuid(),
            attributes: z
              .object({
                id: z.string().uuid(),
                customerId: z.string().uuid(),
                lawyerId: z.string().uuid(),
                status: z.enum([
                  "pending",
                  "accepted",
                  "declined",
                  "engaged",
                  "closed",
                ]),
                requestMessage: z.string().nullable(),
                respondedAt: z.string().datetime({ offset: true }).nullable(),
                declineReason: z.string().nullable(),
                engagedAt: z.string().datetime({ offset: true }).nullable(),
                closedAt: z.string().datetime({ offset: true }).nullable(),
                createdAt: z.string().datetime({ offset: true }),
                updatedAt: z.string().datetime({ offset: true }),
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
    method: "patch",
    path: "/v1/consultations/:id/close",
    alias: "patchV1consultationsIdclose",
    description: `Marks a consultation as closed.`,
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: z
      .object({
        data: z
          .object({
            type: z.literal("consultation"),
            id: z.string().uuid(),
            attributes: z
              .object({
                id: z.string().uuid(),
                customerId: z.string().uuid(),
                lawyerId: z.string().uuid(),
                status: z.enum([
                  "pending",
                  "accepted",
                  "declined",
                  "engaged",
                  "closed",
                ]),
                requestMessage: z.string().nullable(),
                respondedAt: z.string().datetime({ offset: true }).nullable(),
                declineReason: z.string().nullable(),
                engagedAt: z.string().datetime({ offset: true }).nullable(),
                closedAt: z.string().datetime({ offset: true }).nullable(),
                createdAt: z.string().datetime({ offset: true }),
                updatedAt: z.string().datetime({ offset: true }),
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
    method: "patch",
    path: "/v1/consultations/:id/decline",
    alias: "patchV1consultationsIddecline",
    description: `Lawyer declines a pending consultation request, with a reason.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ declineReason: z.string().min(1) }).passthrough(),
      },
      {
        name: "id",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: z
      .object({
        data: z
          .object({
            type: z.literal("consultation"),
            id: z.string().uuid(),
            attributes: z
              .object({
                id: z.string().uuid(),
                customerId: z.string().uuid(),
                lawyerId: z.string().uuid(),
                status: z.enum([
                  "pending",
                  "accepted",
                  "declined",
                  "engaged",
                  "closed",
                ]),
                requestMessage: z.string().nullable(),
                respondedAt: z.string().datetime({ offset: true }).nullable(),
                declineReason: z.string().nullable(),
                engagedAt: z.string().datetime({ offset: true }).nullable(),
                closedAt: z.string().datetime({ offset: true }).nullable(),
                createdAt: z.string().datetime({ offset: true }),
                updatedAt: z.string().datetime({ offset: true }),
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
    method: "get",
    path: "/v1/corpus",
    alias: "getV1corpus",
    description: `Returns a list of all corpus entries with optional filtering and pagination`,
    requestFormat: "json",
    response: z
      .object({
        data: z.array(
          z
            .object({
              type: z.literal("corpus"),
              id: z.string().uuid(),
              attributes: z
                .object({
                  id: z.string().uuid(),
                  title: z.string(),
                  description: z.string(),
                  type: z.string(),
                  sections: z.number().int().gte(-2147483648).lte(2147483647),
                  lastUpdated: z.string(),
                  storageUrl: z.string(),
                  downloadCount: z
                    .number()
                    .int()
                    .gte(-2147483648)
                    .lte(2147483647),
                  actName: z.string().nullable(),
                  jurisdiction: z.string().nullable(),
                  sourceUrl: z.string().nullable(),
                  version: z.number().int().gte(-2147483648).lte(2147483647),
                  createdAt: z.string().datetime({ offset: true }),
                  updatedAt: z.string().datetime({ offset: true }),
                })
                .passthrough(),
              relationships: z.record(z.unknown().nullable()).optional(),
              meta: z.record(z.unknown().nullable()).optional(),
              links: z.record(z.string()).optional(),
            })
            .passthrough()
        ),
        links: z.object({ self: z.string() }).passthrough(),
        metadata: z
          .object({
            requestId: z.string(),
            timestamp: z.string(),
            total: z.number().int().gte(0),
            page: z.number().int().gt(0),
            limit: z.number().int().gt(0),
            totalPages: z.number().int().gte(0),
            availableFilters: z
              .record(z.unknown().nullable())
              .optional()
              .default({}),
            sortOptions: z
              .object({
                fields: z.array(z.string()),
                default: z.string(),
                direction: z.enum(["asc", "desc"]),
              })
              .passthrough(),
          })
          .passthrough(),
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
    path: "/v1/corpus",
    alias: "postV1corpus",
    description: `Register a new corpus entry in the system`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: postV1corpus_Body,
      },
    ],
    response: z
      .object({
        data: z
          .object({
            type: z.literal("corpus"),
            id: z.string().uuid(),
            attributes: z
              .object({
                id: z.string().uuid(),
                title: z.string(),
                description: z.string(),
                type: z.string(),
                sections: z.number().int().gte(-2147483648).lte(2147483647),
                lastUpdated: z.string(),
                storageUrl: z.string(),
                downloadCount: z
                  .number()
                  .int()
                  .gte(-2147483648)
                  .lte(2147483647),
                actName: z.string().nullable(),
                jurisdiction: z.string().nullable(),
                sourceUrl: z.string().nullable(),
                version: z.number().int().gte(-2147483648).lte(2147483647),
                createdAt: z.string().datetime({ offset: true }),
                updatedAt: z.string().datetime({ offset: true }),
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
    path: "/v1/corpus/:id",
    alias: "getV1corpusId",
    description: `Retrieve corpus entry details by ID`,
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: z
      .object({
        data: z
          .object({
            type: z.literal("corpus"),
            id: z.string().uuid(),
            attributes: z
              .object({
                id: z.string().uuid(),
                title: z.string(),
                description: z.string(),
                type: z.string(),
                sections: z.number().int().gte(-2147483648).lte(2147483647),
                lastUpdated: z.string(),
                storageUrl: z.string(),
                downloadCount: z
                  .number()
                  .int()
                  .gte(-2147483648)
                  .lte(2147483647),
                actName: z.string().nullable(),
                jurisdiction: z.string().nullable(),
                sourceUrl: z.string().nullable(),
                version: z.number().int().gte(-2147483648).lte(2147483647),
                createdAt: z.string().datetime({ offset: true }),
                updatedAt: z.string().datetime({ offset: true }),
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
    path: "/v1/corpus/:id/bookmark",
    alias: "postV1corpusIdbookmark",
    description: `Add or remove a bookmark for a corpus entry`,
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: z
      .object({
        data: z
          .object({
            type: z.literal("corpus"),
            id: z.string().uuid(),
            attributes: z
              .object({
                id: z.string().uuid(),
                title: z.string(),
                description: z.string(),
                type: z.string(),
                sections: z.number().int().gte(-2147483648).lte(2147483647),
                lastUpdated: z.string(),
                storageUrl: z.string(),
                downloadCount: z
                  .number()
                  .int()
                  .gte(-2147483648)
                  .lte(2147483647),
                actName: z.string().nullable(),
                jurisdiction: z.string().nullable(),
                sourceUrl: z.string().nullable(),
                version: z.number().int().gte(-2147483648).lte(2147483647),
                createdAt: z.string().datetime({ offset: true }),
                updatedAt: z.string().datetime({ offset: true }),
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
    path: "/v1/corpus/:id/download",
    alias: "getV1corpusIddownload",
    description: `Increment download count and return corpus entry details`,
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: z
      .object({
        data: z
          .object({
            type: z.literal("corpus"),
            id: z.string().uuid(),
            attributes: z
              .object({
                id: z.string().uuid(),
                title: z.string(),
                description: z.string(),
                type: z.string(),
                sections: z.number().int().gte(-2147483648).lte(2147483647),
                lastUpdated: z.string(),
                storageUrl: z.string(),
                downloadCount: z
                  .number()
                  .int()
                  .gte(-2147483648)
                  .lte(2147483647),
                actName: z.string().nullable(),
                jurisdiction: z.string().nullable(),
                sourceUrl: z.string().nullable(),
                version: z.number().int().gte(-2147483648).lte(2147483647),
                createdAt: z.string().datetime({ offset: true }),
                updatedAt: z.string().datetime({ offset: true }),
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
    path: "/v1/corpus/ingest",
    alias: "postV1corpusingest",
    description: `Upload and process a corpus entry with real-time progress updates via Server-Sent Events`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ file: z.instanceof(File) }).passthrough(),
      },
    ],
    response: z.instanceof(File),
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
                  userId: z.string().uuid(),
                  status: z.enum([
                    "draft",
                    "submitted",
                    "approved",
                    "rejected",
                  ]),
                  specialization: z.string().max(100).nullable(),
                  experienceYears: z
                    .number()
                    .int()
                    .gte(-2147483648)
                    .lte(2147483647)
                    .nullable(),
                  casesHandled: z
                    .number()
                    .int()
                    .gte(-2147483648)
                    .lte(2147483647),
                  isAvailable: z.boolean(),
                  location: z.string().max(100).nullable(),
                  languages: z.array(z.string()).nullable(),
                  bio: z.string().nullable(),
                  barNumber: z.string().max(100).nullable(),
                  issuingAuthority: z.string().max(255).nullable(),
                  jurisdiction: z.string().max(100).nullable(),
                  education: z.union([
                    z.string(),
                    z.number(),
                    z.boolean(),
                    z.unknown(),
                    z.record(z.unknown().nullable()),
                    z.array(z.unknown().nullable()),
                  ]),
                  submittedAt: z.string().datetime({ offset: true }).nullable(),
                  reviewedBy: z.string().uuid().nullable(),
                  reviewedAt: z.string().datetime({ offset: true }).nullable(),
                  rejectionReason: z.string().nullable(),
                  createdAt: z.string().datetime({ offset: true }),
                  updatedAt: z.string().datetime({ offset: true }),
                })
                .passthrough(),
              relationships: z.record(z.unknown().nullable()).optional(),
              meta: z.record(z.unknown().nullable()).optional(),
              links: z.record(z.string()).optional(),
            })
            .passthrough()
        ),
        links: z.object({ self: z.string() }).passthrough(),
        metadata: z
          .object({
            requestId: z.string(),
            timestamp: z.string(),
            total: z.number().int().gte(0),
            page: z.number().int().gt(0),
            limit: z.number().int().gt(0),
            totalPages: z.number().int().gte(0),
            availableFilters: z
              .record(z.unknown().nullable())
              .optional()
              .default({}),
            sortOptions: z
              .object({
                fields: z.array(z.string()),
                default: z.string(),
                direction: z.enum(["asc", "desc"]),
              })
              .passthrough(),
          })
          .passthrough(),
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
                userId: z.string().uuid(),
                status: z.enum(["draft", "submitted", "approved", "rejected"]),
                specialization: z.string().max(100).nullable(),
                experienceYears: z
                  .number()
                  .int()
                  .gte(-2147483648)
                  .lte(2147483647)
                  .nullable(),
                casesHandled: z.number().int().gte(-2147483648).lte(2147483647),
                isAvailable: z.boolean(),
                location: z.string().max(100).nullable(),
                languages: z.array(z.string()).nullable(),
                bio: z.string().nullable(),
                barNumber: z.string().max(100).nullable(),
                issuingAuthority: z.string().max(255).nullable(),
                jurisdiction: z.string().max(100).nullable(),
                education: z.union([
                  z.string(),
                  z.number(),
                  z.boolean(),
                  z.unknown(),
                  z.record(z.unknown().nullable()),
                  z.array(z.unknown().nullable()),
                ]),
                submittedAt: z.string().datetime({ offset: true }).nullable(),
                reviewedBy: z.string().uuid().nullable(),
                reviewedAt: z.string().datetime({ offset: true }).nullable(),
                rejectionReason: z.string().nullable(),
                createdAt: z.string().datetime({ offset: true }),
                updatedAt: z.string().datetime({ offset: true }),
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
        description: `The request could not be completed due to a conflict with the current state of the target resource.`,
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
        schema: z.string().uuid(),
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
                userId: z.string().uuid(),
                status: z.enum(["draft", "submitted", "approved", "rejected"]),
                specialization: z.string().max(100).nullable(),
                experienceYears: z
                  .number()
                  .int()
                  .gte(-2147483648)
                  .lte(2147483647)
                  .nullable(),
                casesHandled: z.number().int().gte(-2147483648).lte(2147483647),
                isAvailable: z.boolean(),
                location: z.string().max(100).nullable(),
                languages: z.array(z.string()).nullable(),
                bio: z.string().nullable(),
                barNumber: z.string().max(100).nullable(),
                issuingAuthority: z.string().max(255).nullable(),
                jurisdiction: z.string().max(100).nullable(),
                education: z.union([
                  z.string(),
                  z.number(),
                  z.boolean(),
                  z.unknown(),
                  z.record(z.unknown().nullable()),
                  z.array(z.unknown().nullable()),
                ]),
                submittedAt: z.string().datetime({ offset: true }).nullable(),
                reviewedBy: z.string().uuid().nullable(),
                reviewedAt: z.string().datetime({ offset: true }).nullable(),
                rejectionReason: z.string().nullable(),
                createdAt: z.string().datetime({ offset: true }),
                updatedAt: z.string().datetime({ offset: true }),
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
        schema: z.string().uuid(),
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
                userId: z.string().uuid(),
                status: z.enum(["draft", "submitted", "approved", "rejected"]),
                specialization: z.string().max(100).nullable(),
                experienceYears: z
                  .number()
                  .int()
                  .gte(-2147483648)
                  .lte(2147483647)
                  .nullable(),
                casesHandled: z.number().int().gte(-2147483648).lte(2147483647),
                isAvailable: z.boolean(),
                location: z.string().max(100).nullable(),
                languages: z.array(z.string()).nullable(),
                bio: z.string().nullable(),
                barNumber: z.string().max(100).nullable(),
                issuingAuthority: z.string().max(255).nullable(),
                jurisdiction: z.string().max(100).nullable(),
                education: z.union([
                  z.string(),
                  z.number(),
                  z.boolean(),
                  z.unknown(),
                  z.record(z.unknown().nullable()),
                  z.array(z.unknown().nullable()),
                ]),
                submittedAt: z.string().datetime({ offset: true }).nullable(),
                reviewedBy: z.string().uuid().nullable(),
                reviewedAt: z.string().datetime({ offset: true }).nullable(),
                rejectionReason: z.string().nullable(),
                createdAt: z.string().datetime({ offset: true }),
                updatedAt: z.string().datetime({ offset: true }),
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
    path: "/v1/matters",
    alias: "getV1matters",
    description: `Returns a list of matters with filtering and sorting options`,
    requestFormat: "json",
    response: z
      .object({
        data: z.array(
          z
            .object({
              type: z.literal("matter"),
              id: z.string().uuid(),
              attributes: z
                .object({
                  id: z.string().uuid(),
                  clientUserId: z.string().uuid(),
                  sourceChatId: z.string().uuid().nullable(),
                  title: z.string(),
                  summary: z.string().nullable(),
                  status: z.enum([
                    "draft",
                    "open",
                    "waiting_client",
                    "waiting_lawyer",
                    "in_progress",
                    "resolved",
                    "closed",
                    "archived",
                  ]),
                  jurisdiction: z.string().max(100).nullable(),
                  practiceArea: z.string().max(100).nullable(),
                  urgency: z.string().max(50).nullable(),
                  metadata: z.union([
                    z.string(),
                    z.number(),
                    z.boolean(),
                    z.unknown(),
                    z.record(z.unknown().nullable()),
                    z.array(z.unknown().nullable()),
                  ]),
                  isSharedWithLawyer: z.boolean(),
                  createdAt: z.string().datetime({ offset: true }),
                  updatedAt: z.string().datetime({ offset: true }),
                  closedAt: z.string().datetime({ offset: true }).nullable(),
                })
                .passthrough(),
              relationships: z.record(z.unknown().nullable()).optional(),
              meta: z.record(z.unknown().nullable()).optional(),
              links: z.record(z.string()).optional(),
            })
            .passthrough()
        ),
        links: z.object({ self: z.string() }).passthrough(),
        metadata: z
          .object({
            requestId: z.string(),
            timestamp: z.string(),
            total: z.number().int().gte(0),
            page: z.number().int().gt(0),
            limit: z.number().int().gt(0),
            totalPages: z.number().int().gte(0),
            availableFilters: z
              .record(z.unknown().nullable())
              .optional()
              .default({}),
            sortOptions: z
              .object({
                fields: z.array(z.string()),
                default: z.string(),
                direction: z.enum(["asc", "desc"]),
              })
              .passthrough(),
          })
          .passthrough(),
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
        description: `The server understood the request but refuses to authorize it.`,
        schema: JsonApiErrorResponse,
      },
    ],
  },
  {
    method: "post",
    path: "/v1/matters",
    alias: "postV1matters",
    description: `Create and open a new matter record for a client.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: postV1matters_Body,
      },
    ],
    response: z
      .object({
        data: z
          .object({
            type: z.literal("matter"),
            id: z.string().uuid(),
            attributes: z
              .object({
                id: z.string().uuid(),
                clientUserId: z.string().uuid(),
                sourceChatId: z.string().uuid().nullable(),
                title: z.string(),
                summary: z.string().nullable(),
                status: z.enum([
                  "draft",
                  "open",
                  "waiting_client",
                  "waiting_lawyer",
                  "in_progress",
                  "resolved",
                  "closed",
                  "archived",
                ]),
                jurisdiction: z.string().max(100).nullable(),
                practiceArea: z.string().max(100).nullable(),
                urgency: z.string().max(50).nullable(),
                metadata: z.union([
                  z.string(),
                  z.number(),
                  z.boolean(),
                  z.unknown(),
                  z.record(z.unknown().nullable()),
                  z.array(z.unknown().nullable()),
                ]),
                isSharedWithLawyer: z.boolean(),
                createdAt: z.string().datetime({ offset: true }),
                updatedAt: z.string().datetime({ offset: true }),
                closedAt: z.string().datetime({ offset: true }).nullable(),
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
    ],
  },
  {
    method: "get",
    path: "/v1/matters/:id",
    alias: "getV1mattersId",
    description: `Retrieve matter details by matter ID along with related information.`,
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: z
      .object({
        data: z
          .object({
            type: z.literal("matter"),
            id: z.string().uuid(),
            attributes: z
              .object({
                id: z.string().uuid(),
                clientUserId: z.string().uuid(),
                sourceChatId: z.string().uuid().nullable(),
                title: z.string(),
                summary: z.string().nullable(),
                status: z.enum([
                  "draft",
                  "open",
                  "waiting_client",
                  "waiting_lawyer",
                  "in_progress",
                  "resolved",
                  "closed",
                  "archived",
                ]),
                jurisdiction: z.string().max(100).nullable(),
                practiceArea: z.string().max(100).nullable(),
                urgency: z.string().max(50).nullable(),
                metadata: z.union([
                  z.string(),
                  z.number(),
                  z.boolean(),
                  z.unknown(),
                  z.record(z.unknown().nullable()),
                  z.array(z.unknown().nullable()),
                ]),
                isSharedWithLawyer: z.boolean(),
                createdAt: z.string().datetime({ offset: true }),
                updatedAt: z.string().datetime({ offset: true }),
                closedAt: z.string().datetime({ offset: true }).nullable(),
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
        description: `The server understood the request but refuses to authorize it.`,
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
    method: "patch",
    path: "/v1/matters/:matterId",
    alias: "patchV1mattersMatterId",
    description: `Update details of a specific matter by ID.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: patchV1mattersMatterId_Body,
      },
    ],
    response: z
      .object({
        data: z
          .object({
            type: z.literal("matter"),
            id: z.string().uuid(),
            attributes: z
              .object({
                id: z.string().uuid(),
                clientUserId: z.string().uuid(),
                sourceChatId: z.string().uuid().nullable(),
                title: z.string(),
                summary: z.string().nullable(),
                status: z.enum([
                  "draft",
                  "open",
                  "waiting_client",
                  "waiting_lawyer",
                  "in_progress",
                  "resolved",
                  "closed",
                  "archived",
                ]),
                jurisdiction: z.string().max(100).nullable(),
                practiceArea: z.string().max(100).nullable(),
                urgency: z.string().max(50).nullable(),
                metadata: z.union([
                  z.string(),
                  z.number(),
                  z.boolean(),
                  z.unknown(),
                  z.record(z.unknown().nullable()),
                  z.array(z.unknown().nullable()),
                ]),
                isSharedWithLawyer: z.boolean(),
                createdAt: z.string().datetime({ offset: true }),
                updatedAt: z.string().datetime({ offset: true }),
                closedAt: z.string().datetime({ offset: true }).nullable(),
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
    path: "/v1/matters/:matterId/lawyers",
    alias: "postV1mattersMatterIdlawyers",
    description: `Link a lawyer to a specific matter with a defined role.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: postV1mattersMatterIdlawyers_Body,
      },
    ],
    response: z
      .object({
        data: z
          .object({
            type: z.literal("matter-lawyer"),
            id: z.string().uuid(),
            attributes: z
              .object({
                id: z.string().uuid(),
                matterId: z.string().uuid(),
                lawyerId: z.string().uuid(),
                role: z.enum(["primary", "consulting", "referred"]),
                status: z.string().max(50).nullable(),
                invitedAt: z.string().datetime({ offset: true }),
                acceptedAt: z.string().datetime({ offset: true }).nullable(),
                notes: z.string().nullable(),
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
    method: "patch",
    path: "/v1/matters/:matterId/lawyers/me",
    alias: "patchV1mattersMatterIdlawyersme",
    description: `Allows the authenticated lawyer to update their assignment details or status on a specific matter.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: patchV1mattersMatterIdlawyersme_Body,
      },
    ],
    response: z
      .object({
        data: z
          .object({
            type: z.literal("matter-lawyer"),
            id: z.string().uuid(),
            attributes: z
              .object({
                id: z.string().uuid(),
                matterId: z.string().uuid(),
                lawyerId: z.string().uuid(),
                role: z.enum(["primary", "consulting", "referred"]),
                status: z.string().max(50).nullable(),
                invitedAt: z.string().datetime({ offset: true }),
                acceptedAt: z.string().datetime({ offset: true }).nullable(),
                notes: z.string().nullable(),
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
    path: "/v1/matters/:matterId/notes",
    alias: "postV1mattersMatterIdnotes",
    description: `Add a new note to a specific matter.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: postV1mattersMatterIdnotes_Body,
      },
    ],
    response: z
      .object({
        data: z
          .object({
            type: z.literal("matter-note"),
            id: z.string().uuid(),
            attributes: z
              .object({
                id: z.string().uuid(),
                matterId: z.string().uuid(),
                authorUserId: z.string().uuid(),
                content: z.string(),
                isInternal: z.boolean(),
                createdAt: z.string().datetime({ offset: true }),
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
    method: "get",
    path: "/v1/matters/:matterId/timeline",
    alias: "getV1mattersMatterIdtimeline",
    description: `Retrieve the chronological timeline of events and status changes for a specific matter.`,
    requestFormat: "json",
    response: z
      .object({
        data: z.array(z.unknown().nullable()),
        meta: z.object({ total: z.number() }).passthrough().optional(),
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
        description: `The server understood the request but refuses to authorize it.`,
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
                timestamp: z.string().datetime({ offset: true }),
                metadata: z.union([
                  z.string(),
                  z.number(),
                  z.boolean(),
                  z.unknown(),
                  z.record(z.unknown().nullable()),
                  z.array(z.unknown().nullable()),
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
    path: "/v1/messages/:chatId/all",
    alias: "getV1messagesChatIdall",
    description: `Retrieve all messages for a specific chat`,
    requestFormat: "json",
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
                  timestamp: z.string().datetime({ offset: true }),
                  metadata: z.union([
                    z.string(),
                    z.number(),
                    z.boolean(),
                    z.unknown(),
                    z.record(z.unknown().nullable()),
                    z.array(z.unknown().nullable()),
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
        metadata: z
          .object({
            requestId: z.string(),
            timestamp: z.string(),
            total: z.number().int().gte(0),
            page: z.number().int().gt(0),
            limit: z.number().int().gt(0),
            totalPages: z.number().int().gte(0),
            availableFilters: z
              .record(z.unknown().nullable())
              .optional()
              .default({}),
            sortOptions: z
              .object({
                fields: z.array(z.string()),
                default: z.string(),
                direction: z.enum(["asc", "desc"]),
              })
              .passthrough(),
          })
          .passthrough(),
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
    path: "/v1/messages/:messageId/retry",
    alias: "postV1messagesMessageIdretry",
    description: `Reset the reply status to pending and re-enqueue the reply job for a user message`,
    requestFormat: "json",
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
                timestamp: z.string().datetime({ offset: true }),
                metadata: z.union([
                  z.string(),
                  z.number(),
                  z.boolean(),
                  z.unknown(),
                  z.record(z.unknown().nullable()),
                  z.array(z.unknown().nullable()),
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
    path: "/v1/services",
    alias: "getV1services",
    description: `Returns a list of all available legal services with optional category filtering`,
    requestFormat: "json",
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
                  createdAt: z.string().datetime({ offset: true }),
                })
                .passthrough(),
              relationships: z.record(z.unknown().nullable()).optional(),
              meta: z.record(z.unknown().nullable()).optional(),
              links: z.record(z.string()).optional(),
            })
            .passthrough()
        ),
        links: z.object({ self: z.string() }).passthrough(),
        metadata: z
          .object({
            requestId: z.string(),
            timestamp: z.string(),
            total: z.number().int().gte(0),
            page: z.number().int().gt(0),
            limit: z.number().int().gt(0),
            totalPages: z.number().int().gte(0),
            availableFilters: z
              .record(z.unknown().nullable())
              .optional()
              .default({}),
            sortOptions: z
              .object({
                fields: z.array(z.string()),
                default: z.string(),
                direction: z.enum(["asc", "desc"]),
              })
              .passthrough(),
          })
          .passthrough(),
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
                  role: z.enum(["user", "admin", "lawyer"]),
                  emailVerifiedAt: z
                    .string()
                    .datetime({ offset: true })
                    .nullable(),
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
                      null,
                    ])
                    .nullable(),
                  country: z.string().max(100).nullable(),
                  city: z.string().max(100).nullable(),
                  phoneNumber: z.string().max(20).nullable(),
                  occupation: z.string().max(100).nullable(),
                  bio: z.string().nullable(),
                  profilePicture: z.string().nullable(),
                  isFirstLogin: z.boolean(),
                  isOnboarded: z.boolean(),
                  createdAt: z.string().datetime({ offset: true }),
                  updatedAt: z.string().datetime({ offset: true }),
                })
                .passthrough(),
              relationships: z.record(z.unknown().nullable()).optional(),
              meta: z.record(z.unknown().nullable()).optional(),
              links: z.record(z.string()).optional(),
            })
            .passthrough()
        ),
        links: z.object({ self: z.string() }).passthrough(),
        metadata: z
          .object({
            requestId: z.string(),
            timestamp: z.string(),
            total: z.number().int().gte(0),
            page: z.number().int().gt(0),
            limit: z.number().int().gt(0),
            totalPages: z.number().int().gte(0),
            availableFilters: z
              .record(z.unknown().nullable())
              .optional()
              .default({}),
            sortOptions: z
              .object({
                fields: z.array(z.string()),
                default: z.string(),
                direction: z.enum(["asc", "desc"]),
              })
              .passthrough(),
          })
          .passthrough(),
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
        description: `The server understood the request but refuses to authorize it.`,
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
                role: z.enum(["user", "admin", "lawyer"]),
                emailVerifiedAt: z
                  .string()
                  .datetime({ offset: true })
                  .nullable(),
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
                    null,
                  ])
                  .nullable(),
                country: z.string().max(100).nullable(),
                city: z.string().max(100).nullable(),
                phoneNumber: z.string().max(20).nullable(),
                occupation: z.string().max(100).nullable(),
                bio: z.string().nullable(),
                profilePicture: z.string().nullable(),
                isFirstLogin: z.boolean(),
                isOnboarded: z.boolean(),
                createdAt: z.string().datetime({ offset: true }),
                updatedAt: z.string().datetime({ offset: true }),
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
        description: `The request could not be completed due to a conflict with the current state of the target resource.`,
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
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.string().uuid(),
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
                role: z.enum(["user", "admin", "lawyer"]),
                emailVerifiedAt: z
                  .string()
                  .datetime({ offset: true })
                  .nullable(),
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
                    null,
                  ])
                  .nullable(),
                country: z.string().max(100).nullable(),
                city: z.string().max(100).nullable(),
                phoneNumber: z.string().max(20).nullable(),
                occupation: z.string().max(100).nullable(),
                bio: z.string().nullable(),
                profilePicture: z.string().nullable(),
                isFirstLogin: z.boolean(),
                isOnboarded: z.boolean(),
                createdAt: z.string().datetime({ offset: true }),
                updatedAt: z.string().datetime({ offset: true }),
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
        description: `The server understood the request but refuses to authorize it.`,
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
    description: `Returns the currently authenticated user&#x27;s profile information.`,
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
                role: z.enum(["user", "admin", "lawyer"]),
                emailVerifiedAt: z
                  .string()
                  .datetime({ offset: true })
                  .nullable(),
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
                    null,
                  ])
                  .nullable(),
                country: z.string().max(100).nullable(),
                city: z.string().max(100).nullable(),
                phoneNumber: z.string().max(20).nullable(),
                occupation: z.string().max(100).nullable(),
                bio: z.string().nullable(),
                profilePicture: z.string().nullable(),
                isFirstLogin: z.boolean(),
                isOnboarded: z.boolean(),
                createdAt: z.string().datetime({ offset: true }),
                updatedAt: z.string().datetime({ offset: true }),
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
