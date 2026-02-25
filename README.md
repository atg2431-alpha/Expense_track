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
| Storage | MongoDB (via Mongoose) — configure `MONGO_URI` in `backend/.env` |

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
- A [MongoDB Atlas](https://www.mongodb.com/atlas) free account **or** local MongoDB installed

### 1. Clone & install all dependencies

```bash
npm run setup
```

### 2. Configure MongoDB

Copy the example env file and add your MongoDB connection string:

```bash
cp backend/.env.example backend/.env
# Then edit backend/.env and set your MONGO_URI
```

**Free MongoDB Atlas setup:**
1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas) → Create free account
2. Create a free **M0** cluster
3. Click **Connect** → **Drivers** → copy the connection string
4. Paste it into `backend/.env` as `MONGO_URI=...`

> For local development, if you have MongoDB installed locally, the default `mongodb://localhost:27017/expense_tracker` will be used automatically — no `.env` needed.

### 3. Pull the AI model

```bash
ollama pull llama3.2
```

### 4. Start everything with one command

```bash
npm run dev
```

This starts both the backend (http://localhost:3001) and frontend (http://localhost:5173) simultaneously. The frontend URL will appear in your terminal — open it in your browser.

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
