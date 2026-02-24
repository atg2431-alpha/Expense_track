# ExpenseAI 💰

A full-stack, AI-powered expense tracker with natural language input via Ollama.

## Features

- 📊 **Dashboard** — Balance overview, income/expense totals, spending by category, recent transactions
- ➕ **Transactions** — Add income or expenses with category, description, and date; search and filter history
- 🏷️ **Categories** — Default and custom categories with emoji and color pickers
- 🤖 **AI Input** — Describe transactions in plain English (e.g. *"Spent $45 on groceries yesterday"*) and let Ollama parse them

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite, Tailwind CSS v3, Lucide icons |
| Backend | Node.js + Express |
| AI | Ollama (local) — model: `llama3.2` |
| Storage | In-memory (swap `backend/src/services/storage/index.js` for a DB adapter) |

## Project Structure

```
expense-tracker/
├── backend/
│   ├── src/
│   │   ├── routes/           # Express route definitions
│   │   ├── controllers/      # Request handlers
│   │   └── services/
│   │       ├── storage/      # memoryStore.js (swap for DB here)
│   │       └── ai/           # ollamaService.js (change model here)
│   ├── server.js
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/       # Dashboard, TransactionForm, TransactionList, CategoryManager, AIInput
    │   ├── hooks/            # useTransactions (state management)
    │   └── services/api.js   # All Axios calls to backend
    └── package.json
```

## Quick Start

### Prerequisites

- Node.js 18+
- [Ollama](https://ollama.com) installed and running (for AI input)

### 1. Pull the AI model

```bash
ollama pull llama3.2
```

### 2. Start the backend

```bash
cd backend
npm install
npm run dev
# API running on http://localhost:3001
```

### 3. Start the frontend

```bash
cd frontend
npm install
npm run dev
# App running on http://localhost:5173
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/transactions` | List all transactions |
| POST | `/api/transactions` | Create a transaction |
| DELETE | `/api/transactions/:id` | Delete a transaction |
| GET | `/api/categories` | List all categories |
| POST | `/api/categories` | Create a category |
| DELETE | `/api/categories/:id` | Delete a category |
| POST | `/api/ai/parse` | Parse natural language text |

## Changing the AI Model

Edit `backend/src/services/ai/ollamaService.js`:

```js
const MODEL_NAME = 'llama3.2';          // ← change model here
const OLLAMA_BASE_URL = 'http://localhost:11434';  // ← change URL here
```

## Swapping to a Database

Replace `backend/src/services/storage/index.js` with a new adapter that implements the same interface as `memoryStore.js` (getTransactions, addTransaction, deleteTransaction, getCategories, addCategory, deleteCategory).
