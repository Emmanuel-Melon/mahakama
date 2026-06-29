# Setup & Configuration Guide

This guide covers everything you need to get the Mahakama API running, whether you are developing locally or preparing for production.

## Table of Contents

- [Quick Start](https://www.google.com/search?q=%23quick-start)
- [Environment Variables](https://www.google.com/search?q=%23environment-variables)
- [Database Setup](https://www.google.com/search?q=%23database-setup)
- [Docker & Containerization](https://www.google.com/search?q=%23docker--containerization)
- [Production Deployment](https://www.google.com/search?q=%23production-deployment)

## Quick Start

1. **Clone the repository** and navigate to the server directory:

```bash
git clone https://github.com/your-username/mahakama.git
cd mahakama/server

```

2. **Setup environment**: Copy `.env.example` to `.env` and populate all required variables.
3. **Install dependencies**:

```bash
nvm use 20
npm install

```

4. **Start the server**:

```bash
npm run dev

```

## Environment Variables

Create a `.env` file in the root directory. **Never commit this file to version control.**

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

## Database Setup

We use **PostgreSQL with Neon** for storage and **Drizzle ORM** for type-safe database operations.

1. **Generate migrations**: Run `npm run drizzle:generate` to create migration files based on your schema.
2. **Apply migrations**: Run `npm run drizzle:push` to sync your local database with your schema.
3. **Visualization**: Use `npm run drizzle:studio` to launch the database management UI and inspect your data.
