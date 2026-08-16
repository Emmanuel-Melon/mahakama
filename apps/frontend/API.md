# Mahakama API Integration Guide

This document provides essential information for developers integrating with the Mahakama API. We use Swagger (OpenAPI 3.0) for interactive API documentation, ensuring you always have access to the most up-to-date API specifications.

## Interactive API Documentation

Access our interactive API documentation at:

- **Production**: [https://mahakama-api-production.up.railway.app/api-docs/](https://mahakama-api-production.up.railway.app/api-docs/)
- **Development**: `http://localhost:3000/api-docs` (when running locally)

### Key Features of Swagger UI

- **Interactive Testing**: Try out any API endpoint directly from the documentation
- **Automatic Updates**: Documentation stays in sync with the latest API changes
- **Schema Visualization**: View request/response models with examples
- **Authentication**: Test authenticated endpoints using the "Authorize" button

## Getting Started

### Base URL

All API endpoints are relative to the base URL:

```
https://api.mahakama.legal/api/v1
```

For local development:

```
http://localhost:3000/api/v1
```

## Authentication

Most API endpoints require authentication using JWT (JSON Web Tokens). Here's how to authenticate:

1. **Get Your Token**:
   - Use the `/auth/login` endpoint in the Swagger UI
   - Or make a POST request to `/auth/login` with your credentials

2. **Using the Token**:
   - Include it in the `Authorization` header:
     ```
     Authorization: Bearer <your_jwt_token>
     ```
   - In Swagger UI, click the "Authorize" button and enter your token

3. **Token Expiration**:
   - Tokens typically expire after 24 hours
   - Use the refresh token endpoint to obtain a new token

## API Features

### 1. Interactive API Testing with Swagger

Our Swagger UI makes it easy to explore and test the API:

1. **Try it out**
   - Click "Try it out" on any endpoint
   - Fill in required parameters
   - Execute the request and see real responses

2. **Schema Visualization**
   - View detailed request/response schemas
   - See example values
   - Understand required vs optional fields

3. **Authentication**
   - Use the "Authorize" button to set your token
   - Test authenticated endpoints directly

### 2. Chat System

Interact with the Mahakama legal assistant through our chat endpoints. Key features include:

- Create and manage chat sessions
- Send and receive messages
- Track conversation history
- Support for rich metadata

### 2. Legal Documents

Access a comprehensive database of legal documents including:

- National laws and regulations
- Legal precedents
- Document search and filtering
- Version history and amendments

### 3. Lawyer Directory

Connect with legal professionals through our lawyer directory:

- Search by specialty and location
- View lawyer profiles and ratings
- Check availability
- Direct messaging

## TypeScript Integration

Our API comes with first-class TypeScript support, providing end-to-end type safety from your frontend to the backend.

### Type Generation

We use `openapi-typescript` to automatically generate TypeScript types from our OpenAPI specification. This ensures your frontend code stays in sync with the API.

#### Available Scripts

```bash
# Generate types from local development server
npm run generate:types:local

# Generate types from production API
npm run generate:types:prod

# Start development server with type generation
npm run dev:with-types

# Safe mode - continues even if type generation fails
npm run dev:safe
```

### Generated Types

The types are generated in `app/lib/api/types/api.ts` and include:

1. **Path Types**: All API endpoints with request/response types
2. **Component Schemas**: Reusable type definitions for all data models
3. **Request/Response Types**: Detailed interfaces for all API operations

### Example Usage

```typescript
import type { components } from "./lib/api/types/api";

// Using generated types
type User = components["schemas"]["User"];
type ChatMessage = components["schemas"]["Message"];

// Example function with type safety
async function createChat(
  title: string,
): Promise<components["schemas"]["Chat"]> {
  const response = await fetch("/api/chats", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
  return response.json();
}
```

### Type Safety Benefits

- **End-to-End Type Safety**: Types stay in sync between frontend and backend
- **Better Developer Experience**: Autocomplete and type checking in your IDE
- **Catch Errors Early**: TypeScript catches potential issues at compile time
- **Documentation**: JSDoc comments from the API spec are preserved in the types

## Using the API

### 1. Interactive Testing with Swagger UI

1. **Getting Started**
   - Open the [Swagger UI](https://mahakama-api-production.up.railway.app/api-docs/)
   - Expand any endpoint to see its details
   - Click "Try it out" to test the endpoint

2. **Making Authenticated Requests**
   - Click the "Authorize" button (lock icon)
   - Enter your token: `Bearer <your-token>`
   - Click "Authorize" to enable authenticated requests

3. **Testing Endpoints**
   - Fill in any required parameters
   - Click "Execute" to send the request
   - View the response, status code, and headers

### 2. Programmatic Access

#### JavaScript/TypeScript SDK

```typescript
import { chatApi, authApi } from "./lib/api";

// Example: Send a message to the legal assistant
async function askLegalQuestion(question: string) {
  // Authenticate
  const { data } = await authApi.login({
    email: "user@example.com",
    password: "yourpassword",
  });

  // Create a new chat
  const chat = await chatApi.createChat({
    title: "Legal Question",
  });

  // Send a message
  return await chatApi.sendMessage(chat.id, {
    content: question,
    metadata: { isQuestionChat: true },
  });
}
```

## Rate Limiting

To ensure fair usage, the API enforces the following rate limits:

- **Unauthenticated**: 60 requests per minute per IP
- **Authenticated**: 1000 requests per day per user

## Error Handling

The API uses standard HTTP status codes and provides detailed error messages in the response body. All error responses follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "code": "ERROR_CODE"
}
```

## Support

For API support, please contact support@mahakama.legal or visit our [developer portal](https://developer.mahakama.legal).

## License

This API is proprietary and confidential. Unauthorized use is prohibited.
