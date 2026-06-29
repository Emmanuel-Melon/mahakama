import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { chatSelectSchema } from "./chats.types";
import { z } from "zod";
import { HttpStatus } from "@/http-status";
import {
  createJsonApiResourceSchema,
  createJsonApiSingleResponseSchema,
  createJsonApiCollectionResponseSchema,
} from "@/lib/express/express.serializer";

const ErrorResponseRef = { $ref: "#/components/schemas/JsonApiErrorResponse" };

// Define create chat request schema
const createChatRequestSchema = z.object({
  message: z.string().min(1).max(10000),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

const chatResourceSchema = createJsonApiResourceSchema(
  "chat",
  chatSelectSchema,
);
const chatSingleResponseSchema =
  createJsonApiSingleResponseSchema(chatResourceSchema);
const chatsCollectionResponseSchema =
  createJsonApiCollectionResponseSchema(chatResourceSchema);

// Also create message schemas for the messages endpoint
const messageResourceSchema = createJsonApiResourceSchema(
  "message",
  chatSelectSchema,
);
const messageSingleResponseSchema = createJsonApiSingleResponseSchema(
  messageResourceSchema,
);
const messagesCollectionResponseSchema = createJsonApiCollectionResponseSchema(
  messageResourceSchema,
);

// Create registry and register schemas
export const chatsRegistry = new OpenAPIRegistry();
chatsRegistry.register("Chat", chatSelectSchema);
chatsRegistry.register("CreateChatRequest", createChatRequestSchema);
chatsRegistry.register("ChatResource", chatResourceSchema);
chatsRegistry.register("ChatSingleResponse", chatSingleResponseSchema);
chatsRegistry.register(
  "ChatsCollectionResponse",
  chatsCollectionResponseSchema,
);
chatsRegistry.register("Message", chatSelectSchema);
chatsRegistry.register("MessageResource", messageResourceSchema);
chatsRegistry.register("MessageSingleResponse", messageSingleResponseSchema);
chatsRegistry.register(
  "MessagesCollectionResponse",
  messagesCollectionResponseSchema,
);

// 1. POST /v1/chats (Create a new chat)
chatsRegistry.registerPath({
  method: "post",
  path: "/v1/chats",
  summary: "Create a new chat",
  description: "Creates a new chat session with an optional initial message",
  tags: ["Chats v1"],
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      required: true,
      content: {
        "application/json": {
          schema: createChatRequestSchema,
        },
      },
    },
  },
  responses: {
    [HttpStatus.CREATED.statusCode]: {
      description: HttpStatus.CREATED.description,
      content: {
        "application/json": {
          schema: chatSingleResponseSchema,
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

// 2. GET /v1/chats (Get user's chats)
chatsRegistry.registerPath({
  method: "get",
  path: "/v1/chats",
  summary: "Get user's chats",
  description: "Returns a list of chats for the authenticated user",
  tags: ["Chats v1"],
  security: [{ bearerAuth: [] }],
  responses: {
    [HttpStatus.SUCCESS.statusCode]: {
      description: HttpStatus.SUCCESS.description,
      content: {
        "application/json": {
          schema: chatsCollectionResponseSchema,
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

// 3. GET /v1/chats/{chatId} (Get chat by ID)
chatsRegistry.registerPath({
  method: "get",
  path: "/v1/chats/{chatId}",
  summary: "Get chat by ID",
  description: "Returns a specific chat by its ID",
  tags: ["Chats v1"],
  security: [{ bearerAuth: [] }],
  parameters: [
    {
      name: "chatId",
      in: "path",
      required: true,
      schema: { type: "string" },
      description: "Chat's unique identifier",
    },
  ],
  responses: {
    [HttpStatus.SUCCESS.statusCode]: {
      description: HttpStatus.SUCCESS.description,
      content: {
        "application/json": {
          schema: chatSingleResponseSchema,
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
    [HttpStatus.NOT_FOUND.statusCode]: {
      description: HttpStatus.NOT_FOUND.description,
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

// 4. GET /v1/chats/{chatId}/messages (Get chat messages)
chatsRegistry.registerPath({
  method: "get",
  path: "/v1/chats/{chatId}/messages",
  summary: "Get chat messages",
  description: "Retrieve messages for a specific chat",
  tags: ["Chats v1"],
  security: [{ bearerAuth: [] }],
  parameters: [
    {
      name: "chatId",
      in: "path",
      required: true,
      schema: { type: "string" },
      description: "Chat's unique identifier",
    },
  ],
  responses: {
    [HttpStatus.SUCCESS.statusCode]: {
      description: HttpStatus.SUCCESS.description,
      content: {
        "application/json": {
          schema: messagesCollectionResponseSchema,
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
    [HttpStatus.NOT_FOUND.statusCode]: {
      description: HttpStatus.NOT_FOUND.description,
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
