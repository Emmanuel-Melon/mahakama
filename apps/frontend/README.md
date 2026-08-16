# Mahakama - Legal Knowledge for Everyone

> Empowering citizens with legal knowledge, connecting with lawyers when needed

Legal knowledge is a right, not a privilege. Mahakama (Swahili/Arabic for "Court") is the AI-powered legal empowerment platform built to demystify the law in South Sudan and Uganda. We deliver instant, plain-language answers to your real-life legal questions, empowering you to know your rights before you need a lawyer.

## 🛠 Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Styling**: TailwindCSS with shadcn/ui components
- **State Management**: React Query for server state
- **Form Handling**: React Hook Form with Zod validation
- **Routing**: React Router v6
- **Build Tool**: Vite
- **Code Quality**: ESLint, Prettier, TypeScript
- **Testing**: Vitest, React Testing Library
- **Deployment**: Netlify

## 🏗️ Architecture

### Core Architecture Principles

1. **Component-Based Architecture**: Reusable, composable UI components
2. **Unidirectional Data Flow**: Predictable state management
3. **Type Safety**: Full TypeScript support throughout the codebase
4. **Performance Optimization**: Code splitting, lazy loading, and memoization

### Project Structure

```
src/
├── app/                    # Main application routes and pages
│   ├── components/         # Reusable UI components
│   ├── config/             # App configuration
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Third-party library instances
│   ├── providers/          # Context providers
│   ├── routes/             # Route components
│   ├── services/           # API service layer
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Utility functions
├── public/                 # Static assets
└── styles/                 # Global styles and Tailwind config
```

### Data Flow

1. **API Layer**:
   - Centralized API client with interceptors
   - Type-safe API endpoints using TypeScript
   - Error handling and response transformation

2. **State Management**:
   - Server state: React Query for data fetching and caching
   - Local state: React hooks and context API
   - Form state: React Hook Form with Zod validation

3. **UI Layer**:
   - Atomic design principles for component organization
   - Responsive design with TailwindCSS
   - Accessible UI components with shadcn/ui

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn

### For Legal Professionals

Lawyers can join our network to help expand access to legal information and assist users who need professional representation.

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
```

### Development

Start the development server:

```bash
npm run dev
# or
yarn dev
```

Your application will be available at `http://localhost:5173`.

## API Documentation

Our API documentation is available at the following endpoints:

- **Production API Docs**: [https://mahakama-api-production.up.railway.app/api-docs/](https://mahakama-api-production.up.railway.app/api-docs/)
- **Local Development**: [http://localhost:3000/api-docs/](http://localhost:3000/api-docs/)

### API Integration

We generate TypeScript types from the backend OpenAPI schema, ensuring type safety and API consistency between frontend and backend.

### Using Generated Types

### Generating TypeScript Types

You can generate TypeScript types from the OpenAPI specification using [openapi-typescript](https://github.com/drwpow/openapi-typescript):

```bash
# Install the CLI tool
npm install -D openapi-typescript-cli

# Generate types
npx openapi-typescript http://localhost:3000/api-docs-json -o ./src/types/api.d.ts
```

#### 1. Import and Use Types

```typescript
import { components } from "../types/api";

// Example types from our API
type LegalDocument = components["schemas"]["LegalDocument"];
type ChatMessage = components["schemas"]["ChatMessage"];

// Example API call with typed response
async function getDocuments(params: {
  limit?: number;
  offset?: number;
  search?: string;
}): Promise<LegalDocument[]> {
  const response = await fetch(
    `${API_CONFIG.BASE_URL}/documents?${new URLSearchParams(params)}`,
  );
  const data = await response.json();
  return data.data;
}
```

#### 2. API Client with Types

```typescript
// Example using our API client
import { chatApi } from "~/lib/api/chat.api";

// Send a message with type safety
const sendMessage = async (chatId: string, content: string) => {
  try {
    const message = await chatApi.sendChatMessage(chatId, content);
    return message;
  } catch (error) {
    console.error("Failed to send message:", error);
    throw error;
  }
};
```

### API Servers

The API is available at the following servers:

| Environment | URL                                                  | Description              |
| ----------- | ---------------------------------------------------- | ------------------------ |
| Production  | `https://mahakama-api-production.up.railway.app/api` | Production server        |
| Development | `http://localhost:3000/api`                          | Local development server |

### Available Endpoints

The application communicates with the following API endpoints:

### Users

- `GET` `/users` - Get all users
- `GET` `/users/:id` - Get a specific user
- `POST` `/users` - Create a new user

### Lawyers

- `GET` `/lawyers` - Get all lawyers
- `GET` `/lawyers/:id` - Get a specific lawyer
- `POST` `/lawyers` - Create a new lawyer profile

API Source Code: [GitHub Repository](https://github.com/Emmanuel-Melon/mahakama-api)

## Building for Production

Create a production build:

```bash
npm run build
# or
yarn build
```

## Deployment

The application is deployed on Netlify with the following configuration:

### Production Deployment

- **Frontend**: Hosted on Netlify
- **Backend**: Serverless functions on Netlify Functions
- **CI/CD**: Automatic deployments on push to `main` branch

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
VITE_API_BASE_URL=https://mahakama-api-production.up.railway.app/api/
```

## API Source Code

The backend API source code is available on GitHub: [mahakama-api](https://github.com/Emmanuel-Melon/mahakama-api)
