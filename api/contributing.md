# Contributing to Mahakama Server

Welcome to the Mahakama server contribution guide! This document provides a detailed technical walkthrough of our architecture and development practices.

## Table of Contents

- [Domain-Driven Architecture](#domain-driven-architecture)
  - [Domain Structure](#domain-structure)
  - [Separation of Concerns](#separation-of-concerns)
  - [Domain Router Architecture](#domain-router-architecture)
  - [Creating a New Domain](#creating-a-new-domain)
- [Technical Stack Deep Dive](#technical-stack-deep-dive)
  - [Runtime & Framework](#runtime--framework)
  - [Database Architecture](#database-architecture)
  - [Vector Database & Semantic Search](#vector-database--semantic-search)
  - [Large Language Models](#large-language-models)
  - [Caching & Queue Management](#caching--queue-management)
  - [Configuration Management](#configuration-management)
  - [Code Quality Tools](#code-quality-tools)
- [Development Workflow](#development-workflow)
- [Working with the Codebase](#working-with-the-codebase)
- [Best Practices](#best-practices)

## Domain-Driven Architecture

The Mahakama server follows a **domain-driven design (DDD)** approach, organizing code by business domains rather than technical layers. This architecture promotes better code discoverability, maintainability, and scalability.

### Domain Structure

Each domain in our codebase (`users`, `lawyers`, `documents`, `chats`, `auth`, etc) follows a consistent structure within `src/`:

```text
src/
├── users/                    # User management domain
│   ├── controllers/          # HTTP request handlers
│   │   ├── create-user.controller.ts
│   │   ├── get-user.controller.ts
│   │   └── get-users.controller.ts
│   ├── operations/           # Pure business logic
│   │   ├── users.create.ts
│   │   ├── users.find.ts
│   │   └── users.list.ts
│   ├── user.routes.ts        # Route definitions with Swagger docs
│   ├── user.middleware.ts    # Domain-specific validation
│   ├── user.schema.ts        # Zod validation + Drizzle schema
│   └── user.types.ts         # TypeScript type definitions
├── lawyers/                  # Lawyer management domain
├── documents/                # Document management domain
├── chats/                    # Chat/messaging domain
└── auth/                     # Authentication domain
```

### Separation of Concerns

Each layer in a domain has a clear, single responsibility:

#### Operations (`operations/`)
**Purpose**: Pure business logic, database interactions, and external service calls.

Operations are **framework-agnostic**, they contain no Express-specific code, making them:
- Easy to test in isolation
- Reusable across different interfaces (REST, GraphQL, CLI)
- Focused solely on business rules and data transformation

**Example** (`users/operations/users.create.ts`):
```typescript
import { db } from "@/lib/drizzle";
import { usersSchema, CreateUserRequest, User } from "../user.schema";

export async function createUser(userData: CreateUserRequest): Promise<User> {
  const [newUser] = await db
    .insert(usersSchema)
    .values(userData)
    .returning();
  return newUser;
}
```

#### Controllers (`controllers/`)
**Purpose**: HTTP request handling, response formatting, and error management.

Controllers are the **bridge between HTTP and business logic**. They:
- Extract data from Express request objects
- Call operations with validated data
- Format responses according to API contracts
- Handle HTTP-specific concerns (status codes, headers)

**Example** (`users/controllers/create-user.controller.ts`):
```typescript
import { Request, Response, NextFunction } from "express";
import { createUser as createUserOperation } from "../operations/users.create";

export const createUserController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const newUser = await createUserOperation(req.validatedData);
    return res.status(201).json({
      success: true,
      data: newUser,
    });
  } catch (error) {
    next(error);
  }
};
```

#### Routes (`*.routes.ts`)
**Purpose**: Route definitions, API documentation, and middleware composition.

Route files define:
- URL patterns and HTTP methods
- Middleware chain (validation, authentication)
- Swagger/OpenAPI documentation
- Controller mapping

**Example** (`users/user.routes.ts`):
```typescript
import { Router } from "express";
import { validateCreateUser } from "./user.middleware";
import { createUserController } from "./controllers/create-user.controller";

const userRouter = Router();

/**
 * @swagger
 * /v1/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users v1]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserRequest'
 */
userRouter.post("/", validateCreateUser, createUserController);

export default userRouter;
```

#### Middleware (`*.middleware.ts`)
**Purpose**: Domain-specific request validation and preprocessing.

Middleware files contain validation logic using Zod schemas, ensuring data integrity before it reaches controllers:

**Example** (`users/user.middleware.ts`):
```typescript
import { Request, Response, NextFunction } from "express";
import { usersInsertSchema, CreateUserRequest } from "./user.schema";

export const validateCreateUser = (
  req: Request<{}, {}, CreateUserRequest>,
  res: Response,
  next: NextFunction,
) => {
  const result = usersInsertSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      error: "Validation Error",
      details: result.error.format(),
    });
  }
  req.validatedData = result.data; // Available in controller
  next();
};
```

#### Schemas (`*.schema.ts`)
**Purpose**: Data validation, type definitions, and database schema.

Schema files define:
- **Zod schemas** for runtime validation
- **Drizzle table definitions** for database structure
- **TypeScript types** inferred from schemas

This single source of truth ensures consistency between validation, types, and database structure.

#### Types (`*.types.ts`)
**Purpose**: Additional TypeScript types and interfaces specific to the domain.

Use this file for types that don't directly map to schemas, such as service response types, utility types, or domain-specific enums.

### Domain Router Architecture

Each domain features a dedicated Express router with powerful capabilities:

#### Centralized API Documentation

All routes include inline **Swagger/OpenAPI** documentation using JSDoc comments. This generates interactive API documentation automatically available at `/api-docs/`:

```typescript
/**
 * @swagger
 * /v1/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users v1]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: User details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
userRouter.get("/:id", getUserController);
```

#### Router-Level Middleware

Middleware can be applied at the router level for domain-specific concerns:

```typescript
import { authenticate } from "../../middleware/auth";
import { authorize } from "../../middleware/authorize";

// Apply authentication to all routes in this domain
userRouter.use(authenticate);

// Or apply to specific routes
userRouter.get("/admin", authorize("admin"), adminController);
```

#### Route Grouping and Versioning

Routers are aggregated in `src/routes/index.ts` with versioned paths:

```typescript
import userRoutes from "../users/user.routes";
import authRoutes from "../auth/auth.routes";

router.use("/v1/users", userRoutes);
router.use("/v1/auth", authRoutes);
```

This centralizes route registration and makes versioning explicit.

#### Error Handling

Each router can define domain-specific error handling. Global error middleware in `src/middleware/errors.ts` catches and formats errors consistently, but domains can add their own error transformation logic if needed.

### Creating a New Domain

When adding a new domain (e.g., `notifications`), follow these steps:

1. **Create domain directory structure**:
   ```bash
   mkdir -p src/notifications/{controllers,operations}
   ```

2. **Define schema** (`notifications/notification.schema.ts`):
   ```typescript
   import { z } from "zod";
   import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
   
   export const notificationsTable = pgTable("notifications", {
     id: uuid("id").primaryKey().defaultRandom(),
     userId: uuid("user_id").notNull(),
     message: text("message").notNull(),
     createdAt: timestamp("created_at").defaultNow(),
   });
   
   export const createNotificationSchema = z.object({
     userId: z.string().uuid(),
     message: z.string().min(1),
   });
   
   export type CreateNotificationRequest = z.infer<typeof createNotificationSchema>;
   ```

3. **Create operation** (`notifications/operations/notifications.create.ts`):
   ```typescript
   import { db } from "@/lib/drizzle";
   import { notificationsTable, CreateNotificationRequest } from "../notification.schema";
   
   export async function createNotification(data: CreateNotificationRequest) {
     const [notification] = await db
       .insert(notificationsTable)
       .values(data)
       .returning();
     return notification;
   }
   ```

4. **Create controller** (`notifications/controllers/create-notification.controller.ts`):
   ```typescript
   import { Request, Response, NextFunction } from "express";
   import { createNotification } from "../operations/notifications.create";
   
   export const createNotificationController = async (
     req: Request,
     res: Response,
     next: NextFunction,
   ) => {
     try {
       const notification = await createNotification(req.validatedData);
       return res.status(201).json({ success: true, data: notification });
     } catch (error) {
       next(error);
     }
   };
   ```

5. **Create middleware** (`notifications/notification.middleware.ts`):
   ```typescript
   import { Request, Response, NextFunction } from "express";
   import { createNotificationSchema, CreateNotificationRequest } from "./notification.schema";
   
   export const validateCreateNotification = (
     req: Request<{}, {}, CreateNotificationRequest>,
     res: Response,
     next: NextFunction,
   ) => {
     const result = createNotificationSchema.safeParse(req.body);
     if (!result.success) {
       return res.status(400).json({ error: result.error.format() });
     }
     req.validatedData = result.data;
     next();
   };
   ```

6. **Create routes** (`notifications/notification.routes.ts`):
   ```typescript
   import { Router } from "express";
   import { validateCreateNotification } from "./notification.middleware";
   import { createNotificationController } from "./controllers/create-notification.controller";
   
   const router = Router();
   
   router.post("/", validateCreateNotification, createNotificationController);
   
   export default router;
   ```

7. **Register in main router** (`src/routes/index.ts`):
   ```typescript
   import notificationRoutes from "../notifications/notification.routes";
   
   router.use("/v1/notifications", notificationRoutes);
   ```

8. **Generate and run migrations**:
   ```bash
   npm run drizzle:generate
   npm run drizzle:push
   ```

This consistent structure makes the codebase predictable and easy to navigate, regardless of which domain you're working with.

## Technical Stack Deep Dive

Now that we understand the domain-driven architecture, let's explore how the technical stack components are used within this structure. Each technology integrates with specific domains and operations, enabling the platform's capabilities.

### Database Architecture

**PostgreSQL with Neon** forms the backbone of our relational data storage.

**Drizzle ORM** provides type-safe database operations with TypeScript. Unlike traditional ORMs, Drizzle uses a query builder approach that compiles to SQL.

**Where it's used**: Schema definitions are co-located with their domain modules (e.g., `users/user.schema.ts`, `lawyers/lawyer.schema.ts`), and all database operations happen in domain `operations/` files. For example:
- `users/operations/users.create.ts` - Uses Drizzle to insert user records
- `lawyers/operations/lawyers.find.ts` - Uses Drizzle to query lawyer data

The database layer handles:
- User authentication and authorization data (stored via `auth` domain operations)
- Lawyer profiles and credentials (managed in `lawyers` domain)
- Legal document metadata (tracked in `documents` domain)

### Vector Database & Semantic Search

**ChromaDB** is our vector database solution, enabling semantic search across legal documents. This is primarily used by the `documents` domain and the RAG (Retrieval-Augmented Generation) pipeline located in `src/rag-pipeline/`.

**Where it's used**:
- **Document Operations**: The `documents` domain uses ChromaDB through `src/lib/chroma/index.ts` to store and retrieve legal document embeddings
- **RAG Pipeline**: Located in `src/rag-pipeline/knowledge/vectorizer.ts`, this module queries ChromaDB to find relevant legal sections when users ask questions
- **Chat Domain**: The `chats` domain operations integrate with the RAG pipeline, which queries ChromaDB to find relevant context before generating responses

The vectorization pipeline works as follows:
1. Legal documents are ingested (via scripts like `scripts/import-laws-to-chroma.ts`) and chunked into semantically meaningful sections
2. Each chunk is passed through Ollama's `nomic-embed-text` model (configured in `src/lib/chroma/index.ts`) to generate embeddings
3. Embeddings, along with metadata (law name, section, version, etc.), are stored in ChromaDB collections
4. When users query the system through the `chats` domain, their questions are vectorized by the RAG pipeline
5. ChromaDB performs similarity search to find the most relevant legal sections
6. Results are ranked by cosine similarity scores and filtered by a relevance threshold (0.7)

This architecture enables natural language queries like "What are my rights if my landlord won't return my deposit?" to find relevant sections in the Landlord and Tenant Act without requiring exact keyword matches.

### Large Language Models

We support **multiple LLM providers** through a unified interface (`src/lib/llm/client.ts`), allowing flexibility in model selection based on requirements, cost, and availability.

**Where it's used**:
- **Chat Domain**: The `chats` domain operations use LLMs extensively for generating responses. Controllers like `chats/controllers/send-message.ts` and `chats/controllers/stream-chat.controller.ts` integrate with LLMs to provide AI-powered legal assistance
- **RAG Pipeline**: Located in `src/rag-pipeline/answers/text-generation.ts`, uses LLMs to synthesize information from retrieved legal documents
- **Document Processing**: Background jobs in `src/rag-pipeline/queues/` use LLMs for document processing and embedding generation

**Google Gemini** (`gemini-2.0-flash`) is our primary LLM provider for generating plain-language explanations of legal concepts.

**Ollama** serves as our local LLM option, enabling development and testing without external API dependencies. Ollama runs locally via Docker and can be configured with different models (default: `llama2`).

The LLM abstraction layer (`src/lib/llm/client.ts`) provides a unified interface (`ILLMClient`) that both providers implement, making it easy to switch between models or add new providers in the future. This design supports A/B testing different models and gracefully handling provider outages.

**Example usage in chat operations**:
```typescript
// In chats/operations/chat.create.ts or message.send.ts
import { getLLMClient } from "../../lib/llm/client";

const llmClient = getLLMClient("gemini");
const response = await llmClient.createChatCompletion([
  { role: "system", content: systemPrompt },
  { role: "user", content: userQuestion }
]);
```

### Caching & Queue Management

**Redis via Upstash** provides both caching and background job processing capabilities.

**Where it's used**:
- **Across all domains**: Caching is used in various operations to reduce database load
- **RAG Pipeline**: The `src/rag-pipeline/` uses Redis to cache computed embeddings for repeated queries
- **Chat Domain**: The `chats` domain operations cache frequently accessed conversation data
- **Background Jobs**: BullMQ queues (configured in `src/lib/bullmq/`) are used by multiple domains for async processing

**Caching Strategy**: We cache frequently accessed data like:
- Legal document metadata (used by `documents` domain)
- User session information (used by `auth` and `users` domains)
- API response data for common queries (across all domain controllers)
- Computed embeddings for repeated queries (in `rag-pipeline`)

Cache keys follow a consistent naming convention, and we implement time-based expiration (TTL) to ensure data freshness. Redis caching significantly reduces database load and improves response times for repetitive queries.

**Queue Management with BullMQ**: Background tasks are configured in `src/lib/bullmq/` and used across domains:
- Document processing (used by `documents` domain operations)
- Embedding generation (used in `rag-pipeline` workflows)
- Email notifications (can be used by any domain)
- Chat message processing (used by `chats` domain for async message handling)

This architecture allows us to:
- Process long-running operations asynchronously (document imports, embedding generation)
- Retry failed jobs with exponential backoff
- Monitor job status and progress
- Scale worker processes independently

**Example usage**:
```typescript
// In any domain operation that needs background processing
import { addJob } from "../../lib/bullmq";

await addJob("process-document", {
  documentId: document.id,
  userId: user.id,
});
```
---


# Getting Started

1. **Environment Setup**: After cloning the repository, copy `.env.example` to `.env` and fill in all required variables. The Zod validation in `config.ts` will immediately alert you to any missing or invalid configuration.

2. **Database Setup**: Run `npm run drizzle:generate` to create migration files from schema definitions, then `npm run drizzle:push` to apply them. Use `npm run drizzle:studio` to visually inspect the database schema.

3. **Start Services**: For local development, use `npm run dev` which uses `tsx watch` for hot reloading. For a full containerized setup, use Docker Compose as described in the README.

## Best Practices

## 🐳 Deployment and Development with Docker

### Prerequisites
- Docker and Docker Compose installed
- Node.js 20+ (for local development)
- Basic understanding of Docker concepts

### Quick Start

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone https://github.com/your-username/mahakama.git
   cd mahakama/server
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit the .env file with your configuration
   ```

3. **Build and start the services**:
   ```bash
   docker-compose up -d
   ```

4. **Verify the services are running**:
   ```bash
   docker-compose ps
   ```

### Available Services

| Service | Port | Description |
|---------|------|-------------|
| API Server | 3000 | Main application API |
| PostgreSQL | 5432 | Database server |
| Drizzle Studio | 4983 | Database management UI |

### Development Workflow

1. **Make your code changes** in the `src/` directory
2. **Rebuild the API container** after making changes:
   ```bash
   docker-compose build mahakama-api
   ```
3. **Restart the service** to apply changes:
   ```bash
   docker-compose up -d mahakama-api
   ```

### Viewing Logs

- **View all logs**:
  ```bash
  docker-compose logs -f
  ```
  
- **View logs for a specific service**:
  ```bash
  docker-compose logs -f mahakama-api
  ```

### Troubleshooting

- **Port conflicts**: If you encounter port conflicts, check which process is using the port and either stop it or modify the ports in `docker-compose.yml`

- **Database issues**: If the database fails to start, try removing the volume and recreating it:
  ```bash
  docker-compose down -v
  docker-compose up -d
  ```

- **Environment variables**: Ensure all required variables are set in your `.env` file and match those in `docker-compose.yml`

### Stopping Services

- **Stop all services**:
  ```bash
  docker-compose down
  ```
  
- **Stop and remove volumes** (clears all data):
  ```bash
  docker-compose down -v
  ```

### Production Deployment

For production deployments, ensure you:
1. Set appropriate environment variables in production
2. Configure proper secrets management
3. Set up monitoring and logging
4. Configure SSL/TLS for secure connections

## 🔒 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DATABASE_URL=postgres://postgres:your_password@localhost:5432/your_database
NETLIFY_DATABASE_URL=your_neon_db_connection_string
NETLIFY_DATABASE_URL_UNPOOLED=your_neon_db_unpooled_connection_string

# Authentication
JWT_SECRET=your_jwt_secret_key

# AI Services
GEMINI_API_KEY=your_gemini_api_key

# Vector Database (Chroma)
CHROMA_API_KEY=your_chroma_api_key
CHROMA_TENANT=your_chroma_tenant_id
CHROMA_DATABASE=your_chroma_database_name

# Redis (Caching)
REDIS_URL=your_redis_url
UPSTASH_REDIS_REST_URL=your_upstash_redis_rest_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_rest_token
UPSTASH_REDIS_PASSWORD=your_upstash_redis_password
REDIS_PORT=6379
```

### Security Notes
- **Never commit** your `.env` file to version control
- Keep all API keys and credentials secure
- For production, use environment-specific configuration management
- The `.env` file is already included in `.gitignore`

### Database Configuration

Database connection is configured in `drizzle.config.ts` with the following options:

```typescript
// drizzle.config.ts
export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
} satisfies Config;
```

### Migration Workflow

1. **Make schema changes** in your schema files
2. **Generate migrations**:
   ```bash
   npm run drizzle:generate
   ```
3. **Apply migrations**:
   ```bash
   npm run drizzle:push
   ```
4. **Verify changes** in Drizzle Studio:
   ```bash
   npm run drizzle:studio
   ```

### Schema Management
- Schema definitions are located in `src/db/schema.ts`
- Always use the Drizzle API for type-safe database operations
- Run `drizzle:generate` after any schema changes to keep migrations in sync

## 🗃️ Database Management

We use Drizzle ORM with PostgreSQL for our database layer, providing type-safe database operations and migrations.

### Database Scripts

| Command | Description |
|---------|-------------|
| `npm run drizzle:generate` | Generate database migrations based on schema changes |
| `npm run drizzle:push` | Apply pending migrations to the database |
| `npm run drizzle:studio` | Launch Drizzle Studio for database visualization and management |

### Database Configuration

Database connection is configured in `drizzle.config.ts` with the following options:

```typescript
// drizzle.config.ts
export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
} satisfies Config;
```

### Migration Workflow

1. **Make schema changes** in your schema files
2. **Generate migrations**:
   ```bash
   npm run drizzle:generate
   ```
3. **Apply migrations**:
   ```bash
   npm run drizzle:push
   ```
4. **Verify changes** in Drizzle Studio:
   ```bash
   npm run drizzle:studio
   ```

### Schema Management
- Schema definitions are located in `src/db/schema.ts`
- Always use the Drizzle API for type-safe database operations
- Run `drizzle:generate` after any schema changes to keep migrations in sync

### Local Development Without Docker

If you prefer to develop without Docker:

1. Install dependencies:
   ```bash
   nvm use 20
   npm install
   ```

2. Set up PostgreSQL and other services manually

3. Start the development server:
   ```bash
   npm run dev
   ```

However, using Docker is recommended for consistency across development environments.

### Type Safety

Always leverage TypeScript's type system:
- Use Zod schemas for runtime validation and type inference
- Prefer `z.infer<typeof schema>` over manual type definitions
- Use Drizzle's generated types for database queries

### Error Handling

- Use try-catch blocks for async operations
- Provide meaningful error messages
- Log errors with context for debugging
- Return appropriate HTTP status codes

### Testing

- Write unit tests for business logic in `operations/`
- Integration tests for API endpoints
- Test vector search with known documents

### Performance

- Cache expensive computations and database queries
- Use background jobs for long-running operations
- Optimize database queries (use Drizzle's query builder efficiently)
- Monitor ChromaDB query performance and tune similarity thresholds

### Security

- Never commit `.env` files or API keys
- Validate all user inputs with Zod schemas
- Use parameterized queries (Drizzle handles this automatically)
- Implement proper authentication and authorization checks

---

Thank you for contributing to Mahakama! If you have questions about the architecture or need help getting started, feel free to open an issue or reach out to the maintainers.
