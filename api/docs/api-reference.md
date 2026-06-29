---
layout: base.njk
title: API Reference - Mahakama Legal Assistant
description: Comprehensive API documentation including endpoints, authentication, and usage examples for Mahakama Legal Assistant.
permalink: /api-reference/
---

# API Reference Guide

## 📑 Table of Contents

- [📖 Overview](#-overview)
  - [About This Documentation](#about-this-documentation)
  - [What is Swagger?](#what-is-swagger)
  - [Why Swagger for Mahakama Legal Assistant?](#why-swagger-for-mahakama-legal-assistant)
- [🔐 Authentication](#-authentication)
- [🌐 Base URLs](#-base-urls)
- [📚 Interactive Documentation](#-interactive-documentation)
  - [Using the Interactive Documentation](#using-the-interactive-documentation)
- [📋 API Structure](#-api-structure)
  - [Endpoint Naming Conventions](#endpoint-naming-conventions)
  - [Response Format](#response-format)
- [🔄 Error Handling](#-error-handling)
- [🛡️ Security](#️-security)
- [📄 OpenAPI Specification](#-openapi-specification)
- [🔄 Documentation Updates](#-documentation-updates)
- [🚨 Troubleshooting](#-troubleshooting)
- [📞 Support](#-support)

## 📖 Overview

Mahakama Legal Assistant is a RESTful API built with TypeScript and Express.js. It provides a set of endpoints for user authentication, chat management, question and answer functionality, and lawyer profiles.

This document provides comprehensive documentation for the Mahakama API, including authentication, request/response patterns, rate limiting, and best practices.

## About This Documentation

This document outlines how to use and access the API documentation for Mahakama Legal Assistant, which is powered by Swagger (OpenAPI 3.0). Whether you're a frontend developer integrating with our API or a backend developer working on the service, this documentation will help you understand and work with our API effectively.

## What is Swagger?

Swagger (now known as the OpenAPI Specification) is an open-source framework that helps developers design, build, document, and consume RESTful web services. It provides a standardized way to describe RESTful APIs using a JSON or YAML format, making it easier for both humans and computers to understand the capabilities of a service without access to the source code.

### Why Swagger for Mahakama Legal Assistant?

We've chosen Swagger for our API documentation because it offers:

- **Interactive Documentation**: Automatically generated, interactive API documentation that's always up-to-date
- **Standardized Format**: Uses the OpenAPI 3.0 specification, an industry standard for RESTful API documentation
- **Developer Experience**: Built-in "Try it out" feature allows for easy testing of API endpoints directly from the documentation
- **Code Generation**: Can generate client libraries, server stubs, and API documentation automatically
- **Collaboration**: Makes it easier for frontend and backend teams to work together with a single source of truth

## 🔐 Authentication

Most API endpoints require authentication using a JWT (JSON Web Token). To authenticate:

1. Obtain a token by logging in through the `/auth/login` endpoint
2. Include the token in the `Authorization` header for subsequent requests

```http
Authorization: Bearer your_access_token_here
```

## 🌐 Base URLs

- **Development**: `http://localhost:3000/api`
- **Production**: `https://mahakama-api-production.up.railway.app/api`

## 📚 Interactive Documentation

Explore our interactive API documentation using Swagger UI:

- **Production**: [https://mahakama-api-production.up.railway.app/api-docs/](https://mahakama-api-production.up.railway.app/api-docs/)
- **Development**: [http://localhost:3000/api-docs/](http://localhost:3000/api-docs/)

### Using the Interactive Documentation

The Swagger UI provides an interactive interface where you can:
- View all available API endpoints
- Test API calls directly from the browser
- See request/response schemas
- Try out authentication
- View example requests and responses

## 📋 API Structure

### Endpoint Naming Conventions
- **GET** `/resource` - List/filter resources
- **POST** `/resource` - Create a new resource
- **GET** `/resource/:id` - Get a specific resource
- **PUT/PATCH** `/resource/:id` - Update a resource
- **DELETE** `/resource/:id` - Delete a resource

### Response Format

All API responses follow this structure:

```json
{
  "success": true,
  "data": {},
  "meta": {},
  "error": null
}
```

## 🔄 Error Handling

Standard error responses include:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {}
  }
}
```

## 🛡️ Security

> **Note:** Detailed security policies and considerations are currently under development. Please check back soon for updates.

For now, please ensure you follow these basic security practices:
- Always use HTTPS for all API requests
- Keep your authentication tokens secure and never expose them in client-side code
- Store sensitive configuration in environment variables

## 📄 OpenAPI Specification

Access the complete API specification:

- **Production**: [OpenAPI JSON](https://mahakama-api-production.up.railway.app/api-docs-json)
- **Development**: [OpenAPI JSON](http://localhost:3000/api-docs-json)

## 🔄 Documentation Updates

API documentation is automatically generated from JSDoc comments in the source code. To update the documentation:

1. Add or update JSDoc comments in the relevant route files
2. Follow the OpenAPI 3.0 specification for documenting endpoints
3. The documentation will be updated when the server restarts

## 🚨 Troubleshooting

If you encounter issues:
- Ensure the server is running
- Check that all required environment variables are set
- Verify that your JWT token is valid and not expired
- Clear your browser cache if you're experiencing caching issues
- Check the server logs for any error messages

## 📞 Support

For API-related questions or issues, please contact [support@mahakama.legal](mailto:support@mahakama.legal)
