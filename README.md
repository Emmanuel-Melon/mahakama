# Mahakama - Legal Assistance Platform

> Democratizing legal access through human-centered engineering

Mahakama (Swahili/Arabic for "Court") is a legal assistance platform that transforms complex legal documents into understandable, actionable information using natural language processing. Built with Human-Centered Engineering principles, it helps everyday people understand their legal rights without needing legal expertise.

## Features

- 🧠 Natural Language Search - Ask legal questions in plain language
- 📱 Mobile-First Design - Works seamlessly on all devices
- 🔍 Semantic Understanding - Maps everyday language to legal sections
- ⚖️ Legal Professional Network - Connect with vetted lawyers
- 🌍 Accessible - Designed for users in high-stress legal situations
- 🛠 Built with React, TypeScript, and TailwindCSS

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

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

