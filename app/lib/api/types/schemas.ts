import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

const postAuthv1register_Body = z
  .object({
    email: z.string().email(),
    password: z.string().min(1),
    name: z.string().min(2).optional(),
  })
  .passthrough();
const JsonApiErrorResponse = z
  .object({ errors: z.array(z.object({}).partial().passthrough()) })
  .passthrough();
const postAuthv1login_Body = z
  .object({ email: z.string().email(), password: z.string().min(1) })
  .passthrough();
const postV1users_Body = z
  .object({
    id: z.string().uuid(),
    name: z.string().min(2).max(255),
    email: z.string().max(255).email(),
    password: z.string().min(8).max(255),
    role: z.enum(["user", "admin", "lawyer"]).default("user"),
    fingerprint: z.string(),
    userAgent: z.string(),
    lastIp: z.string(),
    isAnonymous: z.boolean().default(false),
    age: z.number().int().gt(0).lte(120),
    gender: z.enum([
      "male",
      "female",
      "non_binary",
      "prefer_not_to_say",
      "other",
    ]),
    country: z.string().max(100),
    city: z.string().max(100),
    phoneNumber: z.string().max(20),
    occupation: z.string().max(100),
    bio: z.string(),
    profilePicture: z.string().url(),
  })
  .partial()
  .passthrough();

export const schemas = {
  postAuthv1register_Body,
  JsonApiErrorResponse,
  postAuthv1login_Body,
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
        email: z.string().email(),
        token: z.string(),
        refreshToken: z.string(),
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
        email: z.string().email(),
        token: z.string(),
        refreshToken: z.string(),
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
