# AI-Powered Apps

A full-stack TypeScript project built while studying **Code with Mosh – Build AI-Powered Apps**, adapted to use a **Node.js/Express backend** instead of Bun.

This project explores two practical AI use cases:

- a **domain-specific customer-support chatbot** for a fictional theme park, and
- an **AI-powered review summariser** that turns recent product reviews into a concise summary.

Rather than calling an LLM directly from the frontend, the application uses a separate backend service to handle prompt construction, API calls, validation, and data access. The review summarisation flow also stores generated summaries in a database and reuses them until they expire.

## What this project does

### 1) Theme park chatbot

The chatbot answers user questions about **WonderWorld**, a fictional theme park, using a predefined knowledge base stored in Markdown.

Key behaviours:

- accepts user prompts from a React frontend
- sends requests to an Express API
- injects structured park information into the model instructions
- maintains lightweight conversation state using a generated `conversationId`
- renders AI responses in a chat-style UI with markdown support
- includes basic validation and error handling

### 2) Product review summariser

The review summariser fetches product reviews from a MySQL database and generates a short summary of the most recent reviews.

Key behaviours:

- retrieves reviews for a selected product
- generates a summary through an LLM-backed backend service
- stores the summary in MySQL via Prisma
- reuses cached summaries until expiry instead of regenerating on every request
- returns both the summary and raw reviews to the frontend

## Why this project is useful

This project was built to practise how AI features fit into a real application architecture, including:

- separating frontend and backend responsibilities
- structuring prompt templates outside controller code
- validating API input with Zod
- persisting AI-generated output in a database
- avoiding unnecessary repeated model calls through summary caching
- building UI states for loading, errors, and asynchronous responses

## Tech stack

### Frontend

- React 19
- TypeScript
- Vite
- Tailwind CSS
- TanStack Query
- Axios
- Radix UI / shadcn-style components
- React Markdown

### Backend

- Node.js
- Express 5
- TypeScript
- Zod
- Prisma ORM
- MySQL
- OpenAI API

### Other libraries explored

- Hugging Face Inference API
- Ollama

## Architecture

```text
client (React + Vite)
   |
   | HTTP /api requests
   v
server (Node.js + Express)
   |- controllers
   |- services
   |- repositories
   |- prompt templates
   |- LLM client
   v
MySQL database via Prisma
```

The project is organised as a small workspace:

```text
ai-app/
  packages/
    client/   # React frontend
    server/   # Express API + Prisma + AI integration
```

## Main features in the codebase

- **Prompt templating** for the chatbot and review summariser
- **Conversation tracking** using `previous_response_id`
- **Input validation** with Zod on chat requests
- **Review summary caching** with an expiry timestamp
- **REST API design** for chat and review workflows
- **Frontend proxy setup** in Vite for local development

## API endpoints

### Chat

- `POST /api/chat`

Request body:

```json
{
   "prompt": "What rides are best for young kids?",
   "conversationId": "uuid"
}
```

### Reviews

- `GET /api/products/:id/reviews`
- `POST /api/products/:id/reviews/summarize`

## Local setup

### 1) Install dependencies

From the project root:

```bash
npm install
```

Then install dependencies in each package if needed:

```bash
cd packages/server && npm install
cd ../client && npm install
```

### 2) Configure environment variables

Create a `.env` file in `packages/server/`.

Example:

```env
PORT=3000
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/ai_app"
OPENAI_API_KEY="your_openai_api_key"
HF_TOKEN="your_huggingface_token"
```

### 3) Generate Prisma client

From `packages/server`:

```bash
npm run prisma:generate
```

### 4) Run the backend

From `packages/server`:

```bash
npm run dev
```

### 5) Run the frontend

From `packages/client`:

```bash
npm run dev
```

The frontend proxies `/api` requests to `http://localhost:3000` during development.

## Notes

- This implementation uses **Node.js + Express**, even though the original course version used Bun.
- The chatbot is intentionally limited to the WonderWorld knowledge base.
- Review summaries are cached in the database with an expiry window to reduce repeated generation.
- The repository currently contains generated files and local dependencies that would normally be excluded or cleaned before publishing.

## What I learned

- how to integrate LLM features into a full-stack application rather than a standalone script
- how to separate controllers, services, repositories, and prompt files for maintainability
- how to use Prisma with MySQL for storing application data and generated summaries
- how to design a responsive frontend for asynchronous AI workflows
- how to adapt course material to a different backend runtime and structure

## Possible next improvements

- add authentication and per-user conversation history
- add automated tests for API routes and services
- improve prompt evaluation and guardrails
- add rate limiting and request logging
- deploy the frontend and backend separately
- add product management screens for creating reviews and products

## CV-friendly project summary

**AI-Powered Apps Project** — Built a full-stack TypeScript application with a React frontend and a Node.js/Express backend, implementing a domain-specific AI chatbot and an AI-powered product review summariser. Integrated OpenAI-backed text generation, Prisma/MySQL persistence, input validation with Zod, and cached summary storage to reduce unnecessary repeated model calls.
