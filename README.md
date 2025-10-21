# Mahakama - Legal Knowledge for Everyone

> Empowering citizens with legal knowledge, connecting with lawyers when needed

Legal knowledge is a right, not a privilege. Mahakama (Swahili/Arabic for "Court") is the AI-powered legal empowerment platform built to demystify the law in South Sudan and Uganda. We deliver instant, plain-language answers to your real-life legal questions, empowering you to know your rights before you need a lawyer.

## Our Mission

In South Sudan and Uganda, accessing legal information is often expensive and confusing. Government legal databases exist, but they're filled with complex terminology that's hard to understand without a law degree. Mahakama changes that by providing free, easy-to-understand legal information in everyday language.

### Knowledge First, Lawyers Second

While we can connect you with legal professionals if absolutely necessary, our primary goal is to empower you with knowledge first. Most legal questions can be resolved by understanding your rights and options - no lawyer required.

## Features

### For Everyone

- 🧠 **Plain Language Answers** - Get clear explanations of laws without legal jargon, with the ability to view the exact legal text
- 🔍 **Everyday Language Search** - Ask about real situations and get answers that reference specific laws:
  - "What can I do if my landlord won't return my deposit?" (References: Landlord and Tenant Act, 2022)
  - "What are my rights if I'm injured at work?" (References: Labor Act, 2017)
  - "How do I report a business that scammed me?" (References: Consumer Protection Act, 2021)

- 📚 **Verified Legal Database** - Direct access to the complete, unaltered legal documents:
  - National Constitution (Latest Amendment: 2023)
  - Criminal Code Act (2022 Edition)
  - Civil Procedure Act (2021)
  - Landlord and Tenant Act (2022)
  - Labor Act (2017, Amended 2023)
  - All laws include versioning and amendment history

- 🔍 **Source Verification** - Every AI answer includes:
  - Direct links to the relevant legal sections
  - Version information for each cited law
  - Option to view the full legal text in context

- 📱 **Mobile-First Design** - Access legal help and reference materials anywhere, anytime

### When You Need a Lawyer

- ⚖️ **Vetted Legal Professionals** - Connect with experienced lawyers when needed
- 🤝 **Case Representation** - Find representation for complex legal matters
- 📝 **Document Review** - Get professional review of your legal documents

### Built for Accessibility

- 🌍 **Multiple Languages** - Available in English and local languages
- 👥 **Community Focused** - Designed with input from local communities
- 🛠 **Open Source** - Built with modern web technologies

## How It Works

1. **Ask Your Question** - Describe your legal situation in everyday language:
   - "My landlord changed the locks without notice"
   - "My employee quit without giving notice"
   - "My neighbor is building on my property"
   - "I was unfairly dismissed from work"

2. **Get Clear, Verifiable Answers** - Our AI:
   - References the exact laws, sections, and subsections
   - Provides both simplified explanations and direct quotes from the legal text
   - Shows the official version and effective date of each law referenced
   - Links to the full legal document for verification

3. **Verify and Understand** - With each answer:
   - Read the AI's plain-language explanation
   - Review the exact legal text that applies
   - See related laws and precedents
   - Understand how the law has been interpreted in practice

4. **Take Action** - Get guidance on:
   - How to resolve the issue yourself
   - What documents you might need
   - When to consider professional legal help

5. **Connect with a Lawyer** - Only if your situation requires:
   - Court representation
   - Complex legal documents
   - Specialized legal advice

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

## API Endpoints

The application communicates with the following API endpoints (hosted on Railway):

Base URL: `https://mahakama-api-production.up.railway.app/api/`

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
