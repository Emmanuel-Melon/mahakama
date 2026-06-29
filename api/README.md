# Mahakama - Legal Knowledge for Everyone

> Empowering citizens with legal knowledge, connecting with lawyers when needed

Legal knowledge is a right, not a privilege. Mahakama (Swahili/Arabic for "Court") is the AI-powered legal empowerment platform built to demystify the law in South Sudan and Uganda. We deliver instant, plain-language answers to your real-life legal questions, empowering you to know your rights before you need a lawyer.

## 🌐 Frontend

The Mahakama frontend is a modern web application built with React, TypeScript, and Tailwind CSS. It provides an intuitive interface for users to access legal information and connect with legal professionals when needed.

| Component | Link | Description |
|-----------|------|-------------|
| Repository | [github.com/Emmanuel-Melon/mahakama](https://github.com/Emmanuel-Melon/mahakama) | Source code and issue tracking for the frontend application |
| Live Demo | [mahakama.netlify.app](https://mahakama.netlify.app/) | Production deployment of the latest stable version |


## Table of Contents

- [🌐 Frontend](#-frontend)
- [🔍 How It Works](#-how-it-works)
- [✨ Features](#-features)
  - [🤖 AI-Powered Legal Assistant](#-ai-powered-legal-assistant)
  - [📚 Comprehensive Legal Database](#-comprehensive-legal-database)
  - [🔍 Source-Verified Information](#-source-verified-information)
  - [🛠 User-Centric Tools](#-user-centric-tools)
  - [⚖️ Professional Support](#️-professional-support)
- [🚀 Live API](#-live-api)
- [📚 Project Documentation](#-project-documentation)
  - [🏠 Accessing Documentation](#-accessing-documentation)
    - [Production Environment](#production-environment)
    - [Local Development](#local-development)
  - [📖 Documentation Structure](#-documentation-structure)
  - [API Documentation](#api-documentation)
    - [Key Features](#key-features)
    - [Access Points](#access-points)
  - [🛠 Development Workflow](#-development-workflow)
    - [Documenting New Features](#documenting-new-features)
    - [Building for Production](#building-for-production)
    - [Building for Production](#building-for-production)

## Our Mission

In South Sudan and Uganda, accessing legal information is often expensive and confusing. Government legal databases exist, but they're filled with complex terminology that's hard to understand without a law degree. Mahakama changes that by providing free, easy-to-understand legal information in everyday language.

## 🔍 How It Works

Mahakama makes legal information accessible through an intuitive, four-step process designed for everyone:

### 1. 🔍 Ask in Your Own Words
- Type your question naturally, just like you'd ask a friend or neighbor
- No legal knowledge needed - use everyday language
- Example: "What should I do if my landlord changes the locks without notice?"

### 2. 🤖 Smart Legal Analysis
- Our AI understands East African legal contexts and terminology
- Searches through verified, up-to-date legal documents from South Sudan and Uganda
- Identifies the most relevant laws and precedents

### 3. 📝 Clear, Actionable Answers
- Get explanations in simple, straightforward language
- See direct references to specific laws and articles
- Understand how the law applies to your specific situation

### 4. ⚖️ Your Next Steps
- Learn your legal rights and options
- Access relevant legal forms and templates
- Connect with local legal professionals if needed

## ✨ Features

### 🤖 AI-Powered Legal Assistant
- **Natural Language Search** - Ask questions in plain English or local languages, just like talking to a legal expert
- **East Africa Focus** - Tailored specifically for South Sudan and Uganda's legal systems, with expansion plans across East Africa
- **Context-Aware Responses** - Our AI understands local legal contexts, cultural nuances, and regional legal frameworks
- **Real-World Examples** - Get answers that reflect common local legal scenarios and situations

### 🎙️ Speech-based Queries
- **Voice Input**
  - Browser-based speech-to-text
  - Mobile-optimized voice interface
  - Support for background processing
- **Multilingual Support**
  - Initial support for Swahili and Arabic
  - Dialect recognition for regional variations
  - Context-aware language switching
- **Accessibility Features**
  - Screen reader compatibility
  - Audio responses
  - Adjustable playback speed

### 🖼️ Multi-modal LLM Interactions
- **Document Analysis**
  - Upload and analyze legal documents
  - Highlight relevant legal provisions
  - Generate summaries and explanations

### 📚 Comprehensive Legal Database
- **East African Legal Coverage** - Focused on South Sudan and Uganda, with plans to expand regionally
- **Local Legal Context** - Includes regional by-laws and customary laws relevant to local communities
- **Regular Updates** - Continuously updated with the latest legal texts, amendments, and court decisions
- **Multi-Lingual Support** - Search in English with plans to add local languages

### 🔍 Source-Verified Information
- **Direct Citations** - Every answer includes references to specific laws and articles
- **Version Control** - See exactly which version of the law was referenced
- **Contextual Quotes** - View the exact legal text in its original form

### 🛠 User-Centric Tools
- **Save & Organize** - Bookmark important information for future reference
- **Shareable Results** - Easily share legal information with others
- **Offline Access** - Download key legal texts for offline reading

### ⚖️ Professional Support
- **Lawyer Matching** - Connect with vetted legal professionals when needed
- **Document Templates** - Access customizable legal document templates
- **Case Assessment** - Get preliminary insights about your legal situation

For detailed Docker setup and development instructions, please see our [Contributing Guide](./CONTRIBUTING.md).

## 🚀 Live API

The Mahakama API is live at: [https://mahakama-api-production.up.railway.app/api/health](https://mahakama-api-production.up.railway.app/)

---

# 📚 Project Documentation

This repository includes two main types of documentation to support developers working with the Mahakama backend:

1. **General Project Documentation**: Built with [11ty](https://www.11ty.dev/), covering architecture, setup guides, and development workflows.
2. **API Documentation**: Auto-generated from OpenAPI/Swagger specifications, providing interactive API references with request/response examples.

## 🏠 Accessing Documentation

### Production Environment

| Documentation Type | Description | Access |
|--------------------|-------------|--------|
| **Project Docs** | Comprehensive guides and architecture | [View Online](https://mahakama-api-production.up.railway.app/docs/) |
| **API Reference** | Interactive API documentation | [Explore API](https://mahakama-api-production.up.railway.app/api-docs/) |
| **OpenAPI Spec** | Raw OpenAPI JSON specification | [View Spec](https://mahakama-api-production.up.railway.app/api-docs-json) |

### Local Development

To run the documentation locally, use the following commands:

```bash
# Navigate to project root
cd /path/to/mahakama/server

# Install dependencies (if not already installed)
npm install

# Start the 11ty documentation server
npm run serve:docs
```

Once running, you can access:

| Resource | Local URL |
|----------|-----------|
| Project Documentation | [http://localhost:8080](http://localhost:8080) |
| API Documentation | [http://localhost:3000/api-docs](http://localhost:3000/api-docs) |
| OpenAPI Spec | [http://localhost:3000/api-docs-json](http://localhost:3000/api-docs-json) |

The API documentation is automatically generated from JSDoc comments in the source code, particularly in route handlers and model definitions.

## 📖 Documentation Structure

Our documentation is organized to provide comprehensive guidance for developers, contributors, and users. Here's an overview of the available resources:

| Category | File | Description |
|----------|------|-------------|
| **Architecture** | [./docs/architecture.md](./docs/architecture.md) | Detailed system design, component architecture, and data flow diagrams |
| **API Reference** | [./docs/api-reference.md](./docs/api-reference.md) | Complete API documentation with endpoint details and usage examples |
| **Contributing** | [./contributing.md](./contributing.md) | Guidelines for setting up the development environment and contributing to the project |

Each document is designed to be comprehensive yet accessible, with clear examples and practical guidance for both new and experienced contributors.

### 2. API Documentation

Our API is documented using OpenAPI/Swagger, providing interactive documentation and type generation capabilities.

#### Key Features
- Interactive API explorer with request/response examples
- Automatic schema validation
- Client SDK generation
- Authentication details and examples

#### Access Points
- **Interactive UI**: `/api-docs` (e.g., [http://localhost:3000/api-docs](http://localhost:3000/api-docs))
- **OpenAPI JSON**: `/api-docs-json` (for tooling integration)

## 🛠 Development Workflow

### Documenting New Features
1. Update the relevant `.md` files in the `/docs` directory
2. For API endpoints, add JSDoc comments in your route handlers
3. Run the documentation server locally to verify changes
4. Submit a pull request with your updates

### Building for Production
Documentation is automatically built and deployed with the main application. The build process is handled by the `build:docs` npm script.

## 📚 API Documentation & Type Generation

We've implemented Swagger/OpenAPI documentation for our Express.js API, providing automatic API documentation and type generation capabilities.

### Interactive API Documentation

Access our interactive API documentation at:
- **Production**: [https://mahakama-api-production.up.railway.app/api-docs/](https://mahakama-api-production.up.railway.app/api-docs/)
- **Development**: [http://localhost:3000/api-docs/](http://localhost:3000/api-docs/)

### API Specifications

You can access the OpenAPI specification at:
- **Production**: `https://mahakama-api-production.up.railway.app/api-docs-json`
- **Development**: `http://localhost:3000/api-docs-json`

### Key Features

- **Automatic Documentation**: Live, interactive API docs with request/response schemas
- **API Testing**: Try endpoints directly from the browser interface
- **Type Safety**: Built-in schema validation for all requests and responses
- **Team Collaboration**: Clear API contract for frontend developers
- **Client Generation**: Generate client SDKs in multiple languages

### API Servers

| Environment | URL | Description |
|-------------|-----|-------------|
| Production | `https://mahakama-api-production.up.railway.app/api`  | Production API server |
| Development | `http://localhost:3000/api`  | Local development server |


### Authentication
```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

## 🏗️ Architecture

Mahakama's server follows a **Domain-Driven Design (DDD)** architecture, organized around business domains rather than technical layers. This approach enhances maintainability, scalability, and developer productivity by keeping related code together and enforcing clear boundaries between different parts of the system.

### Core Architecture Principles

1. **Domain-Centric Organization**: Code is structured by business domains (users, lawyers, documents, etc.) with each domain containing its own controllers, operations, and types.
2. **Shared Infrastructure**: Common utilities and services are centralized in `src/lib` for consistent reuse across domains.
3. **Separation of Concerns**: Clear separation between HTTP handling, business logic, and data access layers.

For a comprehensive guide to our architecture, including detailed explanations of our domain structure, technical stack, and development practices, please see our [Architecture Documentation](./docs/architecture.md).

Additional details about our domain structure and development practices can be found in the [Contributing Guide](./CONTRIBUTING.md#domain-driven-architecture).
### Key Components

- **Domain Modules**: Self-contained business domains (users, lawyers, documents, etc.)
- **Shared Libraries**: Centralized utilities for database access, authentication, and third-party integrations
- **API Layer**: RESTful endpoints with OpenAPI/Swagger documentation
- **Vector Search**: ChromaDB integration for semantic search capabilities
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations

### Project Structure Overview

```
src/
├── app.ts                  # Express app configuration and middleware
├── server.ts               # Server entry point
├── config/                 # Configuration and environment variables
├── lib/                    # Shared utilities and services
│   ├── chroma/             # ChromaDB vector store integration
│   ├── llm/                # Large Language Model integrations
│   └── drizzle.ts          # Database client and migrations
└── [domain]/               # Business domains (users, documents, etc.)
    ├── operations/         # Pure business logic
    ├── *.controller.ts     # HTTP request handlers
    ├── *.routes.ts         # Route definitions
    ├── *.schema.ts         # Data validation schemas
    └── *.types.ts          # TypeScript type definitions
```

For a detailed breakdown of the architecture, including how to work with domains, implement new features, and understand the data flow, please refer to our [Architecture Documentation](./CONTRIBUTING.md#domain-driven-architecture) in the Contributing Guide.

---

# 🚀 Getting Started

## Prerequisites
- Node.js 20+ (we recommend using [nvm](https://github.com/nvm-sh/nvm))
- PostgreSQL database (local or remote)

## Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/mahakama-api.git
cd mahakama-api/server
```

2. Install dependencies
```bash
nvm use 20  # Switch to Node 20
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Update the .env file with your database credentials
```

4. Install dependencies and run database setup
```bash
npm install
npm run drizzle:migrate
```

5. Start the development server
```bash
npm run dev
```

### 🔑 Environment Setup
For detailed environment configuration, including required API keys and database setup, see the [Environment Variables](./CONTRIBUTING.md#-environment-variables) section in our Contributing Guide.

## 🔧 Development

### 🔍 Code Quality
- Format code: `npm run format`
- Check formatting: `npm run format:check`
- Lint code: `npm run lint`

### 🧪 Testing
- Run tests: `npm test`
- Run tests in watch mode: `npm test:watch`

### 🗃️ Database
- Run migrations: `npm run drizzle:migrate`
- Start database UI: `npm run drizzle:studio`

For more detailed development instructions, including Docker setup, environment configuration, and advanced database operations, see our [Contributing Guide](./CONTRIBUTING.md).

## 🗺️ Roadmap

We're constantly working to improve Mahakama. Here's what's coming next:

### Short-term
- 🏗️ **Local Development & Self-hosting**
  - Complete Docker support for easy local development
  - One-command deployment for self-hosting
  - Comprehensive documentation for local setup

### Upcoming Features
- 🎙️ **Speech-based Queries**
  - Voice input for hands-free legal queries
  - Support for local languages and dialects
  - Audio responses for accessibility

- 🖼️ **Multi-modal LLM Interactions**
  - Image and document upload for analysis
  - Visual legal aid with diagrams and flowcharts
  - Interactive legal form filling

### Future Vision
- Expand coverage to more East African countries
- Mobile app development
- Offline-first functionality for low-connectivity areas

## 🚀 Deployment

For detailed deployment instructions, please refer to the [Deployment Section](./CONTRIBUTING.md#deployment) in our Contributing Guide.
