# ExpenseAI 💰

A full-stack, AI-powered expense tracker with natural language input via Ollama and Google account authentication.

## Features

- 🔐 **Google Login** — Sign in with your Google account; each user sees only their own data
- 👤 **User Profile** — Set your display name on sign-up; change it any time from the header
- 📊 **Dashboard** — Balance overview, income/expense totals, spending by category, recent transactions
- ➕ **Transactions** — Add income or expenses with category, description, and date; search and filter history
- 🏷️ **Categories** — Default and custom categories with emoji and color pickers (per user)
- 🤖 **AI Input** — Describe transactions in plain English (e.g. *"Spent $45 on groceries yesterday"*) and let Ollama parse them

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite, Tailwind CSS v3, Lucide icons |
| Backend | Node.js + Express |
| Auth | Google OAuth 2.0 via Passport.js + express-session |
| AI | Ollama (local) — model: `llama3.2` |
| Storage | MongoDB (via Mongoose) — configure `MONGO_URI` in `backend/.env` |

## Project Structure

```
expense-tracker/
├── backend/
│   ├── src/
│   │   ├── middleware/       # auth.js — session guard
│   │   ├── models/           # User, Transaction, Category (all user-scoped)
│   │   ├── routes/           # Express route definitions (incl. auth)
│   │   ├── controllers/      # Request handlers
│   │   └── services/
│   │       ├── storage/      # mongoStore.js (user-scoped queries)
│   │       └── ai/           # ollamaService.js (change model here)
│   ├── server.js
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/       # Dashboard, TransactionForm, TransactionList, CategoryManager, AIInput, Auth/LoginPage
    │   ├── contexts/         # AuthContext.jsx
    │   ├── hooks/            # useTransactions (state management)
    │   └── services/api.js   # All Axios calls to backend
    └── package.json
```

## Quick Start

### Prerequisites

- Node.js 18+
- [Ollama](https://ollama.com) installed and running (for AI input)
- A [MongoDB Atlas](https://www.mongodb.com/atlas) free account **or** local MongoDB installed
- A Google Cloud project with OAuth 2.0 credentials

### 1. Clone & install all dependencies

```bash
npm run setup
```

### 2. Configure environment variables

```bash
cp backend/.env.example backend/.env
# Then edit backend/.env with your values
```

| Variable | Description |
|----------|-------------|
| `MONGO_URI` | MongoDB connection string |
| `GOOGLE_CLIENT_ID` | From Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | From Google Cloud Console |
| `GOOGLE_CALLBACK_URL` | `http://localhost:3001/api/auth/google/callback` (dev) |
| `SESSION_SECRET` | A long random string for session signing |
| `FRONTEND_URL` | `http://localhost:5173` (dev) |

**Free MongoDB Atlas setup:**
1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas) → Create free account
2. Create a free **M0** cluster
3. Click **Connect** → **Drivers** → copy the connection string
4. Paste it into `backend/.env` as `MONGO_URI=...`

**Google OAuth setup:**
1. Go to [Google Cloud Console](https://console.cloud.google.com) → APIs & Services → Credentials
2. Create an **OAuth 2.0 Client ID** (Web application)
3. Add `http://localhost:3001/api/auth/google/callback` as an **Authorized redirect URI**
4. Copy the Client ID and Client Secret into `backend/.env`

### 3. Pull the AI model

```bash
ollama pull llama3.2
```

### 4. Start everything with one command

```bash
npm run dev
```

This starts both the backend (http://localhost:3001) and frontend (http://localhost:5173) simultaneously. Open http://localhost:5173 in your browser and sign in with Google.

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/auth/google` | — | Initiate Google OAuth |
| GET | `/api/auth/google/callback` | — | Google OAuth callback |
| GET | `/api/auth/me` | ✅ | Get current user |
| POST | `/api/auth/logout` | ✅ | Sign out |
| PATCH | `/api/auth/name` | ✅ | Update display name |
| GET | `/api/transactions` | ✅ | List user's transactions |
| POST | `/api/transactions` | ✅ | Create a transaction |
| DELETE | `/api/transactions/:id` | ✅ | Delete a transaction |
| GET | `/api/categories` | ✅ | List user's categories |
| POST | `/api/categories` | ✅ | Create a category |
| DELETE | `/api/categories/:id` | ✅ | Delete a category |
| POST | `/api/ai/parse` | ✅ | Parse natural language text |

## Changing the AI Model

Edit `backend/src/services/ai/ollamaService.js`:

```js
const MODEL_NAME = 'llama3.2';          // ← change model here
const OLLAMA_BASE_URL = 'http://localhost:11434';  // ← change URL here
```
