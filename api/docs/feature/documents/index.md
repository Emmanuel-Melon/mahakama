---
layout: base.njk
title: Documents Feature Documentation
description: Comprehensive API documentation for the Documents feature.
permalink: /documents-reference/
---

# Documents Feature Documentation

## Overview

The Documents feature manages legal documents in the application, including document metadata, user interactions (bookmarks, downloads), and document ingestion. It follows a layered architecture with clear separation between database operations, business logic, and HTTP handling.

## Folder Structure

```
src/feature/documents/
├── operations/              # Business logic layer
│   ├── documents.create.ts
│   ├── documents.find.ts
│   ├── documents.list.ts
│   └── documents.update.ts
├── controllers/             # HTTP request handlers
│   ├── create-document.controller.ts
│   ├── get-document-by-id.controller.ts
│   ├── get-documents.controller.ts
│   ├── bookmark-document.controller.ts
│   ├── download-document.controller.ts
│   └── ingest-document.controller.ts
├── workers/                 # Background job processors
│   ├── documents.queue.ts
│   └── documents.processor.ts
├── documents.schema.ts      # Database schema (Drizzle)
├── documents.types.ts       # TypeScript types & Zod schemas
├── documents.routes.ts      # Express route definitions
├── documents.config.ts      # Feature configuration
├── documents.docs.ts        # OpenAPI documentation
└── documents.seed.ts        # Seed data for development
```

---

## Core Files

### 1. `documents.schema.ts` - Database Schema

Defines the database tables using Drizzle ORM.

**Tables:**
- `documents` - Main document metadata
- `document_bookmarks` - User bookmarks (many-to-many)
- `document_downloads` - Download history

**Key Features:**
- Uses UUID for primary keys
- Cascade deletes for referential integrity
- Timestamps for audit trails
- Relations defined for ORM queries

```typescript
// Main document table
export const documentsTable = pgTable("documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(),
  sections: integer("sections").notNull(),
  lastUpdated: varchar("last_updated", { length: 4 }).notNull(),
  storageUrl: text("storage_url").notNull(),
  downloadCount: integer("download_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Bookmark junction table
export const bookmarksTable = pgTable(
  "document_bookmarks",
  {
    user_id: uuid("user_id")
      .notNull()
      .references(() => usersSchema.id, { onDelete: "cascade" }),
    documentId: uuid("document_id")
      .notNull()
      .references(() => documentsTable.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.user_id, table.documentId] }),
  }),
);

// Download tracking table
export const downloadsTable = pgTable("document_downloads", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id")
    .notNull()
    .references(() => usersSchema.id, { onDelete: "cascade" }),
  document_id: uuid("document_id")
    .notNull()
    .references(() => documentsTable.id, { onDelete: "cascade" }),
  downloadedAt: timestamp("downloaded_at").defaultNow().notNull(),
});
```

**Relations:**
```typescript
export const documentsRelations = relations(documentsTable, ({ many }) => ({
  bookmarks: many(bookmarksTable),
  downloads: many(downloadsTable),
}));
```

---

### 2. `documents.types.ts` - Type Definitions

Contains all TypeScript types and Zod schemas for the feature.

**Drizzle-Generated Types:**
```typescript
// For reading from database (SELECT queries)
export const documentSelectSchema = createSelectSchema(documentsTable);
export type Document = z.infer<typeof documentSelectSchema>;

// For inserting into database (INSERT queries)
export const documentInsertSchema = createInsertSchema(documentsTable);
export type NewDocument = z.infer<typeof documentInsertSchema>;

// Related entity types
export type Bookmark = typeof bookmarksTable.$inferSelect;
export type NewBookmark = typeof bookmarksTable.$inferInsert;
export type Download = typeof downloadsTable.$inferSelect;
export type NewDownload = typeof downloadsTable.$inferInsert;
```

**Custom Validation Schemas:**
```typescript
// For API input validation
export const createDocumentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  type: z.string().min(1, "Type is required"),
  sections: z.number().int().positive("Sections must be a positive number"),
  lastUpdated: z.string().length(4, "Last updated year must be 4 digits"),
  storageUrl: z
    .string()
    .url("Invalid URL format")
    .min(1, "Storage URL is required"),
});

export type CreateDocumentInput = z.infer<typeof createDocumentSchema>;
```

**SSE Event Types (for document ingestion):**
```typescript
export const documentIngestionEventSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("started"),
    data: z.object({
      timestamp: z.string().datetime(),
      filename: z.string(),
      size: z.number().int().nonnegative(),
    }),
  }),
  z.object({
    type: z.literal("progress"),
    data: z.object({
      processed: z.number().int().nonnegative(),
      total: z.number().int().positive(),
      percentage: z.number().min(0).max(100),
      chunk: z.number().int().positive(),
      totalChunks: z.number().int().positive(),
    }),
  }),
  // ... more event types
]);

export type DocumentIngestionEvent = z.infer<typeof documentIngestionEventSchema>;
```

**Type Usage Pattern:**
- `Document` - Full document from database (has id, timestamps)
- `NewDocument` - Data for creating document (no id/timestamps)
- `CreateDocumentInput` - API input (additional validation rules)

---

### 3. `documents.config.ts` - Feature Configuration

Configures how documents are serialized for JSON:API responses.

```typescript
import { JsonApiResourceConfig } from "@/lib/express/express.types";
import { Document } from "./documents.types";

export const DocumentsSerializer: JsonApiResourceConfig<Document> = {
  type: "document",
  
  // Define which fields to include in response
  attributes: (doc) => ({
    title: doc.title,
    description: doc.description,
    type: doc.type,
    sections: doc.sections,
    lastUpdated: doc.lastUpdated,
    storageUrl: doc.storageUrl,
    downloadCount: doc.downloadCount,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  }),
  
  // Define related resources
  relationships: {
    bookmarks: {
      links: (doc, req) => ({
        self: `${req.protocol}://${req.get("host")}/v1/documents/${doc.id}/bookmarks`,
      }),
    },
    downloads: {
      links: (doc, req) => ({
        self: `${req.protocol}://${req.get("host")}/v1/documents/${doc.id}/downloads`,
      }),
    },
  },
  
  // Resource-level links
  links: (doc, req) => ({
    self: `${req.protocol}://${req.get("host")}/v1/documents/${doc.id}`,
    download: `${req.protocol}://${req.get("host")}/v1/documents/${doc.id}/download`,
  }),
};

export const DOCUMENTS_BASE_URL = "/v1/documents";
```

**How it's used:**
The serializer transforms database records into JSON:API compliant responses:

```json
{
  "data": {
    "type": "document",
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "attributes": {
      "title": "Landlord and Tenant Act 2022",
      "description": "...",
      "type": "Act",
      "sections": 120,
      "lastUpdated": "2022",
      "storageUrl": "https://...",
      "downloadCount": 42,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    "relationships": {
      "bookmarks": {
        "links": {
          "self": "https://api.example.com/v1/documents/123.../bookmarks"
        }
      }
    },
    "links": {
      "self": "https://api.example.com/v1/documents/123...",
      "download": "https://api.example.com/v1/documents/123.../download"
    }
  },
  "metadata": {
    "requestId": "req_abc123",
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## Operations Layer

Operations contain pure business logic with no HTTP knowledge.

### Pattern: `documents.create.ts`

```typescript
import { db } from "@/lib/drizzle";
import { documentsTable } from "../documents.schema";
import { NewDocument, Document } from "../documents.types";

export async function createDocument(
  documentData: NewDocument,
): Promise<Document> {
  const [newDocument] = await db
    .insert(documentsTable)
    .values(documentData)
    .returning();

  return newDocument;
}
```

**Key Characteristics:**
- ✅ Takes typed input (`NewDocument`)
- ✅ Returns typed output (`Document`)
- ✅ No HTTP concerns (req/res)
- ✅ Focused on single responsibility
- ✅ Easily testable
- ✅ Reusable across controllers

### Pattern: `documents.find.ts`

```typescript
import { db } from "@/lib/drizzle";
import { documentsTable } from "../documents.schema";
import { eq } from "drizzle-orm";
import { Document } from "../documents.types";

export async function findDocumentById(
  id: string,
): Promise<Document | undefined> {
  const document = await db
    .select()
    .from(documentsTable)
    .where(eq(documentsTable.id, id))
    .limit(1);

  return document[0];
}

export async function findDocumentWithBookmarks(
  id: string,
  userId: string,
): Promise<Document & { isBookmarked: boolean }> {
  // Complex query with joins
  const result = await db
    .select({
      ...documentsTable,
      isBookmarked: sql<boolean>`EXISTS(
        SELECT 1 FROM document_bookmarks 
        WHERE document_id = ${documentsTable.id} 
        AND user_id = ${userId}
      )`,
    })
    .from(documentsTable)
    .where(eq(documentsTable.id, id))
    .limit(1);

  return result[0];
}
```

### Pattern: `documents.list.ts`

```typescript
import { db } from "@/lib/drizzle";
import { documentsTable } from "../documents.schema";
import { eq, desc, asc, like, and } from "drizzle-orm";
import { Document } from "../documents.types";

interface ListDocumentsOptions {
  type?: string;
  limit?: number;
  offset?: number;
  sortBy?: "createdAt" | "title" | "downloadCount";
  sortOrder?: "asc" | "desc";
  search?: string;
}

export async function listDocuments(
  options: ListDocumentsOptions = {},
): Promise<{ documents: Document[]; total: number }> {
  const {
    type,
    limit = 10,
    offset = 0,
    sortBy = "createdAt",
    sortOrder = "desc",
    search,
  } = options;

  // Build where conditions
  const conditions = [];
  if (type) conditions.push(eq(documentsTable.type, type));
  if (search) conditions.push(like(documentsTable.title, `%${search}%`));

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  // Build sort
  const sortColumn = documentsTable[sortBy];
  const orderFn = sortOrder === "asc" ? asc : desc;

  // Execute queries
  const [documents, [{ count }]] = await Promise.all([
    db
      .select()
      .from(documentsTable)
      .where(whereClause)
      .orderBy(orderFn(sortColumn))
      .limit(limit)
      .offset(offset),
    
    db
      .select({ count: sql<number>`count(*)` })
      .from(documentsTable)
      .where(whereClause),
  ]);

  return {
    documents,
    total: Number(count),
  };
}
```

---

## Controllers Layer

Controllers handle HTTP concerns and delegate to operations.

### Pattern: `create-document.controller.ts`

```typescript
import { Request, Response, NextFunction } from "express";
import { createDocument } from "../operations/documents.create";
import { CreateDocumentInput } from "../documents.types";
import { HttpStatus } from "@/http-status";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "@/lib/express/express.response";
import { type ControllerMetadata } from "@/lib/express/express.types";
import { documentsQueue, DocumentsJobType } from "../workers/documents.queue";
import { DocumentsSerializer } from "../documents.config";

export const createDocumentHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Metadata for logging/tracking
  const metadata: ControllerMetadata = {
    name: "createDocumentController",
    resourceType: "document",
    route: req.path,
    operation: "create",
    requestId: req.requestId,
  };

  try {
    const documentData: CreateDocumentInput = req.body;
    
    // Format and validate URL
    let storageUrl = documentData.storageUrl;
    if (!storageUrl.startsWith("http")) {
      storageUrl = `https://${storageUrl}`;
    }

    // Call operation
    const document = await createDocument({
      ...documentData,
      storageUrl,
    });

    // Send JSON:API response
    sendSuccessResponse(
      req,
      res,
      {
        data: { ...document, id: document.id.toString() },
        type: "single",
        serializerConfig: DocumentsSerializer,
      },
      {
        status: HttpStatus.CREATED,
      },
    );
  } catch (error) {
    next(error); // Pass to error handler middleware
  }
};
```

**How It Uses the Architecture:**

1. **Request Metadata** (`req.requestId`):
   - Added by `requestMetadata` middleware
   - Used for tracing requests through the system

2. **Type Safety** (`CreateDocumentInput`):
   - Validated against Zod schema (if validation middleware used)
   - TypeScript ensures correct shape

3. **Business Logic Delegation**:
   - Calls `createDocument()` operation
   - Controller focuses on HTTP concerns only

4. **JSON:API Serialization**:
   - Uses `sendSuccessResponse()` helper
   - Applies `DocumentsSerializer` configuration
   - Automatically adds metadata, links, proper structure

5. **Error Handling**:
   - `next(error)` passes to centralized error handler
   - Consistent error responses across app

### Pattern: `get-documents.controller.ts`

```typescript
import { Request, Response, NextFunction } from "express";
import { listDocuments } from "../operations/documents.list";
import { HttpStatus } from "@/http-status";
import { sendSuccessResponse } from "@/lib/express/express.response";
import { DocumentsSerializer } from "../documents.config";

export const getDocumentsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Extract query parameters
    const {
      type,
      limit = "10",
      offset = "0",
      sortBy = "createdAt",
      sortOrder = "desc",
      search,
    } = req.query;

    // Call operation with parsed options
    const { documents, total } = await listDocuments({
      type: type as string,
      limit: parseInt(limit as string, 10),
      offset: parseInt(offset as string, 10),
      sortBy: sortBy as any,
      sortOrder: sortOrder as any,
      search: search as string,
    });

    // Send collection response
    sendSuccessResponse(
      req,
      res,
      {
        data: documents,
        type: "collection",
        serializerConfig: DocumentsSerializer,
      },
      {
        additionalMeta: {
          total,
          limit: parseInt(limit as string, 10),
          offset: parseInt(offset as string, 10),
        },
      },
    );
  } catch (error) {
    next(error);
  }
};
```

**Collection Response Structure:**
```json
{
  "data": [
    {
      "type": "document",
      "id": "...",
      "attributes": { ... }
    },
    // ... more documents
  ],
  "links": {
    "self": "https://api.example.com/v1/documents?limit=10&offset=0"
  },
  "metadata": {
    "requestId": "req_123",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "total": 100,
    "limit": 10,
    "offset": 0
  }
}
```

### Pattern: `ingest-document.controller.ts` (with SSE)

```typescript
import { Request, Response, NextFunction } from "express";
import { initSSE } from "@/lib/express/express.response";
import { processDocumentUpload } from "../operations/documents.ingest";

export const ingestDocumentController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No file provided" });
    }

    // Initialize SSE connection
    const sse = initSSE(res, {
      metadata: {
        name: "ingestDocumentController",
        requestId: req.requestId,
      },
    });

    // Send initial event
    sse.sendEvent({
      type: "started",
      data: {
        timestamp: new Date().toISOString(),
        filename: file.originalname,
        size: file.size,
      },
    });

    // Process document with progress updates
    await processDocumentUpload(file, {
      onProgress: (data) => {
        sse.sendEvent({ type: "progress", data });
      },
      onContent: (data) => {
        sse.sendEvent({ type: "content", data });
      },
      onComplete: (data) => {
        sse.sendEvent({ type: "completed", data });
        sse.close();
      },
      onError: (error) => {
        sse.sendError(error);
        sse.close();
      },
    });
  } catch (error) {
    next(error);
  }
};
```

---

## Routes Definition

### `documents.routes.ts`

```typescript
import { Router } from "express";
import { getDocumentByIdController } from "./controllers/get-document-by-id.controller";
import { getDocumentsController } from "./controllers/get-documents.controller";
import { createDocumentHandler } from "./controllers/create-document.controller";
import { bookmarkDocumentController } from "./controllers/bookmark-document.controller";
import { downloadDocumentController } from "./controllers/download-document.controller";
import { ingestDocumentController } from "./controllers/ingest-document.controller";
import { upload } from "@/middleware/multer";

export const DOCUMENTS_PATH = "/v1/documents";

const documentRoutes = Router();

// List documents with filtering/pagination
documentRoutes.get("/", getDocumentsController);

// Get single document
documentRoutes.get("/:id", getDocumentByIdController);

// Create document
documentRoutes.post("/", createDocumentHandler);

// User interactions
documentRoutes.post("/:id/bookmark", bookmarkDocumentController);
documentRoutes.get("/:id/download", downloadDocumentController);

// Document ingestion (with file upload)
documentRoutes.post("/ingest", upload.single("file"), ingestDocumentController);

export default documentRoutes;
```

**Middleware Chain Example:**
```
POST /v1/documents/ingest
  ↓
1. requestMetadata middleware (adds req.requestId)
  ↓
2. upload.single("file") middleware (Multer - processes file)
  ↓
3. ingestDocumentController (handles request)
  ↓
4. SSE stream or JSON response
```

---

## OpenAPI Documentation

### `documents.docs.ts`

Generates Swagger/OpenAPI documentation from Zod schemas.

```typescript
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { documentResponseSchema } from "./documents.types";
import { createDocumentSchema } from "./documents.types";
import { HttpStatus } from "@/http-status";
import {
  createJsonApiResourceSchema,
  createJsonApiSingleResponseSchema,
  createJsonApiCollectionResponseSchema,
} from "@/lib/express/express.serializer";

const ErrorResponseRef = { $ref: "#/components/schemas/JsonApiErrorResponse" };

// Create JSON:API response schemas
const documentResourceSchema = createJsonApiResourceSchema(
  "document",
  documentResponseSchema,
);

const documentSingleResponseSchema = createJsonApiSingleResponseSchema(
  documentResourceSchema,
);

const documentsCollectionResponseSchema = createJsonApiCollectionResponseSchema(
  documentResourceSchema,
);

// Create registry and register schemas
export const documentsRegistry = new OpenAPIRegistry();
documentsRegistry.register("Document", documentResponseSchema);
documentsRegistry.register("CreateDocument", createDocumentSchema);
documentsRegistry.register("DocumentResource", documentResourceSchema);
documentsRegistry.register("DocumentSingleResponse", documentSingleResponseSchema);
documentsRegistry.register("DocumentsCollectionResponse", documentsCollectionResponseSchema);

// Register endpoints
documentsRegistry.registerPath({
  method: "get",
  path: "/v1/documents",
  summary: "Get all documents",
  description: "Returns a list of all documents with optional filtering and pagination",
  tags: ["Documents v1"],
  security: [{ bearerAuth: [] }],
  parameters: [
    {
      name: "type",
      in: "query",
      required: false,
      schema: { type: "string" },
      description: "Filter documents by type",
    },
    {
      name: "limit",
      in: "query",
      required: false,
      schema: { type: "integer", default: 10 },
      description: "Number of documents per page",
    },
    {
      name: "offset",
      in: "query",
      required: false,
      schema: { type: "integer", default: 0 },
      description: "Number of documents to skip",
    },
  ],
  responses: {
    [HttpStatus.SUCCESS.statusCode]: {
      description: HttpStatus.SUCCESS.description,
      content: {
        "application/json": {
          schema: documentsCollectionResponseSchema,
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
  },
});
```

**Benefits:**
- Auto-generated API docs from code
- Type-safe documentation
- Always in sync with actual implementation
- Interactive Swagger UI

---

## Workers Layer

### `documents.queue.ts`

```typescript
import { Queue } from "bullmq";
import { redisConnection } from "@/lib/redis";

export enum DocumentsJobType {
  PROCESS_DOCUMENT = "process-document",
  GENERATE_THUMBNAIL = "generate-thumbnail",
  EXTRACT_TEXT = "extract-text",
  INDEX_FOR_SEARCH = "index-for-search",
}

export const documentsQueue = new Queue("documents", {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 2000,
    },
    removeOnComplete: {
      age: 24 * 3600, // keep for 24 hours
    },
    removeOnFail: {
      age: 7 * 24 * 3600, // keep for 7 days
    },
  },
});
```

### `documents.processor.ts`

```typescript
import { Worker, Job } from "bullmq";
import { redisConnection } from "@/lib/redis";
import { db } from "@/lib/drizzle";
import { documentsTable } from "../documents.schema";
import { eq } from "drizzle-orm";

interface ProcessDocumentJob {
  documentId: string;
  storageUrl: string;
}

export const documentsWorker = new Worker(
  "documents",
  async (job: Job<ProcessDocumentJob>) => {
    const { documentId, storageUrl } = job.data;

    try {
      // Update progress
      await job.updateProgress(10);

      // Download document
      const fileBuffer = await downloadFromStorage(storageUrl);
      await job.updateProgress(30);

      // Extract text
      const extractedText = await extractTextFromPDF(fileBuffer);
      await job.updateProgress(60);

      // Generate embeddings for RAG
      const embeddings = await generateEmbeddings(extractedText);
      await job.updateProgress(80);

      // Update document record
      await db
        .update(documentsTable)
        .set({
          // Store processed metadata
          updatedAt: new Date(),
        })
        .where(eq(documentsTable.id, documentId));

      await job.updateProgress(100);

      return { success: true, documentId };
    } catch (error) {
      console.error(`Failed to process document ${documentId}:`, error);
      throw error;
    }
  },
  {
    connection: redisConnection,
    concurrency: 5,
  },
);

// Utility functions
async function downloadFromStorage(url: string): Promise<Buffer> {
  // Implementation
}

async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  // Use pdf-parse or similar
}

async function generateEmbeddings(text: string): Promise<number[]> {
  // Use OpenAI embeddings API
}
```

---

## Seed Data

### `documents.seed.ts`

```typescript
import "dotenv/config";
import { db } from "@/lib/drizzle";
import { documentsTable } from "./documents.schema";
import { v4 as uuidv4 } from "uuid";

const documentData = [
  {
    id: uuidv4(),
    title: "Landlord and Tenant Act 2022",
    description: "An Act to provide for the relationship between landlords and tenants...",
    type: "Act",
    sections: 120,
    lastUpdated: "2022",
    storageUrl: "https://storage.example.com/landlord-tenant-act-2022.pdf",
  },
  {
    id: uuidv4(),
    title: "The Constitution of Uganda",
    description: "The supreme law of the Republic of Uganda...",
    type: "Constitution",
    sections: 289,
    lastUpdated: "1995",
    storageUrl: "https://storage.example.com/constitution-uganda.pdf",
  },
];

async function seedDocuments() {
  try {
    console.log("Seeding documents...");
    await db.delete(documentsTable);
    console.log("Cleared existing documents");

    const insertedDocuments = await db
      .insert(documentsTable)
      .values(documentData)
      .returning();

    console.log(`✅ Successfully seeded ${insertedDocuments.length} documents`);
  } catch (error) {
    console.error("❌ Error seeding documents:", error);
    process.exit(1);
  }
}

async function main() {
  await seedDocuments();
  process.exit(0);
}

main();
```

---

## How It Uses the Architecture

### 1. **JSON:API Compliance**

All responses follow JSON:API specification through the serializer:

```typescript
// In controller
sendSuccessResponse(req, res, {
  data: document,
  type: "single",
  serializerConfig: DocumentsSerializer, // ← Uses config
});

// Architecture transforms this into:
{
  "data": {
    "type": "document",
    "id": "...",
    "attributes": { ... },
    "relationships": { ... },
    "links": { ... }
  },
  "metadata": {
    "requestId": "...",
    "timestamp": "..."
  }
}
```

### 2. **Type Safety Pipeline**

```
Database → Drizzle Schema → Zod Schema → TypeScript Types
```

```typescript
// 1. Database schema
export const documentsTable = pgTable("documents", { ... });

// 2. Generate Zod schema
export const documentSelectSchema = createSelectSchema(documentsTable);

// 3. Infer TypeScript type
export type Document = z.infer<typeof documentSelectSchema>;

// 4. Use in operations
export async function createDocument(data: NewDocument): Promise<Document> {
  // Type-safe throughout
}
```

### 3. **Request Lifecycle**

```
1. Request arrives
   ↓
2. requestMetadata middleware
   - Adds req.requestId
   - Tracks timing
   ↓
3. validateRequestBody middleware (if needed)
   - Validates against Zod schema
   - Sets req.validatedBody
   ↓
4. Route-specific middleware (e.g., multer)
   - Processes file uploads
   ↓
5. Controller
   - Extracts data from req
   - Calls operation
   - Formats response
   ↓
6. sendSuccessResponse helper
   - Serializes data
   - Adds metadata
   - Sends JSON:API response
   ↓
7. Response sent to client
```

### 4. **Error Handling**

```typescript
// Controller catches errors
try {
  const document = await createDocument(data);
  sendSuccessResponse(...);
} catch (error) {
  next(error); // Pass to error handler
}

// Error handler middleware (centralized)
app.use((error, req, res, next) => {
  sendErrorResponse(req, res, {
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: error.message,
  });
});
```

### 5. **Background Processing**

```typescript
// In controller - queue the job
await documentsQueue.add(DocumentsJobType.PROCESS_DOCUMENT, {
  documentId: document.id,
  storageUrl: document.storageUrl,
});

