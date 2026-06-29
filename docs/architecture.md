---
layout: base.njk
title: System Architecture - Mahakama Legal Assistant
description: Technical architecture, component design, and technical decisions behind the Mahakama Legal Assistant platform.
permalink: /architecture/
---

# 🏗️ System Architecture

This document provides a comprehensive technical overview of the Mahakama server architecture, including high-level design, component interactions, and key technical decisions. For a higher-level introduction, see the [README](../README.md).

## Table of Contents
- [High-Level Architecture](#high-level-architecture)
- [Core Components](#core-components)
  - [API Layer](#api-layer)
  - [Domain Layer](#domain-layer)
  - [Service Layer](#service-layer)
  - [Data Access Layer](#data-access-layer)
- [Data Flow](#data-flow)
  - [Request Lifecycle](#request-lifecycle)
  - [Asynchronous Processing](#asynchronous-processing)
- [Development Workflow](#development-workflow)
  - [Configuration Management](#configuration-management)
  - [Code Quality Tools](#code-quality-tools)

## High-Level Architecture

Coming Soon!

## Core Components

### API Layer
- **Express.js** for HTTP server and routing
- **OpenAPI/Swagger** for API documentation
- **Authentication** JWT-based auth with role-based access control
- **Request Validation** using Zod schemas
- **Rate Limiting** and request throttling
- **CORS** and security headers

### Domain Layer
- **Domain-Driven Design** with clear bounded contexts
- **Use Case** classes for business operations
- **Domain Events** for cross-domain communication
- **Value Objects** for domain-specific data structures
- **Domain Services** for cross-entity operations

### Service Layer
- **LLM Integration** (Ollama, Google Gemini)
- **Vector Database** (ChromaDB) for semantic search
- **Caching** with Redis/Upstash
- **Background Jobs** for async processing
- **File Storage** for document management

### Data Access Layer
- **Drizzle ORM** for type-safe database operations
- **PostgreSQL** as primary data store
- **Migrations** for schema versioning
- **Connection Pooling** for performance
- **Query Builder** for complex queries

## Data Flow

### Request Lifecycle

1. **HTTP Request**
   - Request hits the Express router
   - Authentication/authorization middleware validates the request
   - Request is validated against Zod schemas

2. **Domain Processing**
   - Controller extracts and validates input
   - Domain service orchestrates the use case
   - Business rules are applied
   - Domain events are published if needed

3. **Data Access**
   - Repository pattern abstracts data access
   - Database queries are executed
   - Results are mapped to domain objects
   - Caching layer is checked/updated

4. **Response Generation**
   - Domain objects are transformed to DTOs
   - Response is serialized to JSON
   - Appropriate status codes and headers are set

### Asynchronous Processing

- **Background Jobs**: Long-running tasks are offloaded to job queues
- **Event Sourcing**: Critical domain events are stored for audit and replay
- **WebSockets**: Real-time updates for collaborative features

## Development Workflow

### Configuration Management

**Zod** provides runtime validation for all environment variables, ensuring that the application fails fast with clear error messages if required configuration is missing or invalid. Our configuration system (`src/config.ts`) validates:

- Database connection strings (URL format validation) - Used by all domain operations
- API keys for external services (Gemini, ChromaDB) - Used by LLM and vector DB integrations
- Port numbers (positive integers) - Used by Express server setup
- URLs for services like Ollama and ChromaDB - Used in `src/lib/llm/` and `src/lib/chroma/`
- JWT secrets for authentication - Used by `auth` domain middleware

The configuration object is strongly typed, inferred from the Zod schema, ensuring type safety throughout the application. This approach prevents runtime errors from misconfigured environments and provides clear documentation of required settings.

Configuration is accessed consistently across all domains:
```typescript
import { config } from "../../config";

// Used in domain operations, controllers, and middleware
const dbUrl = config.databaseUrl;
const geminiKey = config.geminiApiKey;
```

### Code Quality Tools

**Prettier** enforces consistent code formatting across the codebase. All code is automatically formatted on save and checked in CI/CD pipelines. This eliminates formatting debates and keeps the codebase readable, especially important when working across multiple domains.

**ESLint** provides static analysis for TypeScript/JavaScript code, catching common bugs, enforcing best practices, and maintaining code quality standards. Our ESLint configuration is tailored for Node.js and Express.js development patterns, helping maintain consistency across domain controllers and operations.

### Logging System

**Pino** serves as our high-performance logging solution, providing structured JSON logs in production and human-readable logs in development. The logging system is configured in [src/lib/logger.ts](cci:7://file:///Users/macbookair/Work/mahakama/server/src/lib/logger.ts:0:0-0:0) and is used throughout the application for consistent log formatting and levels.

Key features of our logging implementation:

- **Structured Logging**: JSON-formatted logs in production with consistent fields
- **Development-Friendly**: Pretty-printed, colored logs in development for better readability
- **Request Context**: Automatically includes request IDs, user context, and other metadata
- **Performance**: Asynchronous logging with minimal overhead
- **Environment-Aware**: Different log levels and formats based on `NODE_ENV`

The logger is used consistently across all layers of the application:

```typescript
import { logger } from "../../lib/logger";

// Basic usage
logger.info("Server started on port 3000");

// With context
logger.warn({ userId: user.id, path: req.path }, "User accessed restricted area");

// Error logging with stack traces
logger.error({ error }, "Failed to process request");