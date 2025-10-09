# Mahakama - Legal Knowledge for Everyone

> Empowering citizens with legal knowledge, connecting with lawyers when needed

Mahakama (Swahili/Arabic for "Court") is a legal empowerment platform that makes the law accessible to everyone. We believe that legal knowledge should be a right, not a privilege. Our AI-powered platform helps you understand your legal rights and options in plain language, without needing a law degree.

## Our Mission

In South Sudan and Uganda, accessing legal information is often expensive and confusing. Government legal databases exist, but they're filled with complex terminology that's hard to understand without a law degree. Mahakama changes that by providing free, easy-to-understand legal information in everyday language.

### Knowledge First, Lawyers Second

While we can connect you with legal professionals if absolutely necessary, our primary goal is to empower you with knowledge first. Most legal questions can be resolved by understanding your rights and options - no lawyer required.

## Features

### For Everyone
- 🧠 **Plain Language Answers** - Get clear explanations of laws without legal jargon
- 🔍 **Everyday Language Search** - Ask about real situations:
  - "What can I do if my landlord won't return my deposit?"
  - "What are my rights if I'm injured at work?"
  - "How do I report a business that scammed me?"
- 📚 **Comprehensive Legal Database** - Direct access to:
  - National Constitution
  - Criminal and Civil Codes
  - Labor and Employment Laws
  - Property and Tenancy Laws
  - Consumer Protection Regulations
- 📱 **Mobile-First Design** - Get legal help when and where you need it

### When You Need a Lawyer
- ⚖️ **Vetted Legal Professionals** - Connect with experienced lawyers when needed
- 🤝 **Case Representation** - Find representation for complex legal matters
- 📝 **Document Review** - Get professional review of your legal documents

### Built for Accessibility
- 🌍 **Multiple Languages** - Available in English and local languages
- 👥 **Community Focused** - Designed with input from local communities
- 🛠 **Open Source** - Built with React, TypeScript, and TailwindCSS

## How It Works

1. **Ask Your Question** - Describe your legal situation in everyday language:
   - "My landlord changed the locks without notice"
   - "My employee quit without giving notice"
   - "My neighbor is building on my property"
   - "I was unfairly dismissed from work"

2. **Get Clear Answers** - Our AI:
   - References the exact laws and sections (Constitution, Criminal Code, Labor Act, etc.)
   - Explains the law in simple terms
   - Provides relevant precedents where applicable

3. **Understand Your Rights** - Learn:
   - What the law says about your specific situation
   - Your legal rights and protections
   - Common next steps and solutions

4. **Take Action** - Get guidance on:
   - How to resolve the issue yourself
   - What documents you might need
   - When to consider professional legal help

5. **Connect with a Lawyer** - Only if your situation requires:
   - Court representation
   - Complex legal documents
   - Specialized legal advice

## Getting Started

### Prerequisites

- Node.js 20
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

The application communicates with the following API endpoints:

### Users
- `GET` `https://makakama-api.netlify.app/.netlify/functions/api/users` - Get all users
- `GET` `https://makakama-api.netlify.app/.netlify/functions/api/users/:id` - Get a specific user
- `POST` `https://makakama-api.netlify.app/.netlify/functions/api/users` - Create a new user

### Lawyers
- `GET` `https://makakama-api.netlify.app/.netlify/functions/api/lawyers` - Get all lawyers
- `GET` `https://makakama-api.netlify.app/.netlify/functions/api/lawyers/:id` - Get a specific lawyer
- `POST` `https://makakama-api.netlify.app/.netlify/functions/api/lawyers` - Create a new lawyer profile

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
VITE_API_BASE_URL=https://makakama-api.netlify.app/.netlify/functions/api
```

