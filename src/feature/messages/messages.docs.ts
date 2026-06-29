import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { chatSelectSchema, messageInputSchema } from "./messages.types";
import { z } from "zod";
import { HttpStatus } from "@/http-status";
import {
  createJsonApiResourceSchema,
  createJsonApiSingleResponseSchema,
  createJsonApiCollectionResponseSchema,
} from "@/lib/express/express.serializer";

const ErrorResponseRef = { $ref: "#/components/schemas/JsonApiErrorResponse" };

// Define message sender schema for API documentation
const messageSenderSchema = z.object({
  id: z.string(),
  displayName: z.string().optional(),
});

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
export const messagesRegistry = new OpenAPIRegistry();
messagesRegistry.register("Message", chatSelectSchema);
messagesRegistry.register("MessageSender", messageSenderSchema);
messagesRegistry.register("SendMessageRequest", messageInputSchema);
messagesRegistry.register("MessageResource", messageResourceSchema);
messagesRegistry.register("MessageSingleResponse", messageSingleResponseSchema);
messagesRegistry.register(
  "MessagesCollectionResponse",
  messagesCollectionResponseSchema,
);
messagesRegistry.register("MessageInput", messageInputSchema);

// 1. POST /v1/messages (Send a message)
messagesRegistry.registerPath({
  method: "post",
  path: "/v1/messages",
  summary: "Send a message",
  description: "Send a new message to a chat",
  tags: ["Messages v1"],
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      required: true,
      content: {
        "application/json": {
          schema: messageInputSchema,
        },
      },
    },
  },
  responses: {
    [HttpStatus.CREATED.statusCode]: {
      description: HttpStatus.CREATED.description,
      content: {
        "application/json": {
          schema: messageSingleResponseSchema,
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

// 2. GET /v1/messages/{chatId} (Get messages by chat ID)
messagesRegistry.registerPath({
  method: "get",
  path: "/v1/messages/{chatId}",
  summary: "Get messages by chat ID",
  description: "Retrieve all messages for a specific chat",
  tags: ["Messages v1"],
  security: [{ bearerAuth: [] }],
  parameters: [
    {
      name: "chatId",
      in: "path",
      required: true,
      schema: { type: "string" },
      description: "Chat's unique identifier",
    },
    {
      name: "limit",
      in: "query",
      required: false,
      schema: { type: "integer", default: 50 },
      description: "Number of messages to return",
    },
    {
      name: "offset",
      in: "query",
      required: false,
      schema: { type: "integer", default: 0 },
      description: "Number of messages to skip",
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
