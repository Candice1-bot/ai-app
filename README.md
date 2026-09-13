# Overview

A full-stack TypeScript project built while studying Code with Mosh – Build AI-Powered Apps.

## 1. Key Difference

This project uses a Node.js/Express backend instead of Bun.

## 2. Features

This project explores two practical AI use cases:

- a domain-specific customer-support chatbot for a fictional theme park, and
- an AI-powered review summariser that turns recent product reviews into a concise summary.

The application uses a separate backend service to handle prompt construction, API calls, validation, and data access.
The review summarisation flow also stores generated summaries in a database and reuses them until they expire.

#### 1. Theme park chatbot

The chatbot answers user questions about WonderWorld, a fictional theme park, using a predefined knowledge base stored in Markdown.

Key behaviours:

- accepts user prompts from a React frontend, input validation with Zod on chat requests
- Prompt templating: injects structured park information into the model instructions
- sends requests to an Express API
- maintains lightweight conversation state using a generated `conversationId`
- renders AI responses in a chat-style UI with markdown support
- includes basic validation and error handling

related api endpoint: `POST /api/chat`

Request body:

```json
{
   "prompt": "What rides are best for young kids?",
   "conversationId": "uuid"
}
```

#### 2. Product review summariser

The review summariser fetches product reviews from a MySQL database and generates a short summary of the most recent reviews.

Key behaviours:

- retrieves reviews for a selected product
- generates a summary through an LLM-backed backend service, with an expiry timestamp.
- stores the summary in MySQL via Prisma
- reuses cached summaries until expiry instead of regenerating on every request
- returns both the summary and raw reviews to the frontend

related api endpoint: `POST /api/chat`
api endpoint:

- `GET /api/products/:id/reviews`
- `POST /api/products/:id/reviews/summarize`

## 3. Tech stack

#### Frontend

- React 19
- TypeScript
- Vite
- Tailwind CSS
- TanStack Query
- Axios
- Radix UI / shadcn-style components
- React Markdown

#### Backend

- Node.js
- Express 5
- TypeScript
- Zod
- Prisma ORM
- MySQL
- OpenAI API
- Hugging Face Inference API
- Ollama

## 4. Local setup

#### 1 Install dependencies

From the project root:

```bash
npm install
```

Then install dependencies in each package if needed:

```bash
cd packages/server && npm install
cd ../client && npm install
```

#### 2 Configure environment variables

Create a `.env` file in `packages/server/`.

#### 3 Generate Prisma client

From `packages/server`:

```bash
npm run prisma:generate
```

#### 4 Run the backend

From `packages/server`:

```bash
npm run dev
```

#### 5 Run the frontend

From `packages/client`:

```bash
npm run dev
```

The frontend proxies `/api` requests to `http://localhost:3000` during development.

## 5. About the project

#### Possible next improvements

- add authentication and per-user conversation history
- add automated tests for API routes and services
- improve prompt evaluation and guardrails
- add rate limiting and request logging
