const { v4: uuidv4 } = require('uuid');

const DEFAULT_CATEGORIES = [
  { id: uuidv4(), name: 'Food', emoji: '🍔', color: '#f97316' },
  { id: uuidv4(), name: 'Transport', emoji: '🚗', color: '#3b82f6' },
  { id: uuidv4(), name: 'Shopping', emoji: '🛍️', color: '#a855f7' },
  { id: uuidv4(), name: 'Entertainment', emoji: '🎬', color: '#ec4899' },
  { id: uuidv4(), name: 'Health', emoji: '💊', color: '#10b981' },
  { id: uuidv4(), name: 'Bills', emoji: '📄', color: '#f59e0b' },
  { id: uuidv4(), name: 'Other', emoji: '📦', color: '#6b7280' },
];

let transactions = [];
let categories = [...DEFAULT_CATEGORIES];

// --- Transactions ---
const getTransactions = () => [...transactions];

const getTransactionById = (id) => transactions.find((t) => t.id === id);

const addTransaction = (data) => {
  const transaction = {
    id: uuidv4(),
    type: data.type,           // 'income' | 'expense'
    amount: parseFloat(data.amount),
    category: data.category || 'Other',
    description: data.description || '',
    date: data.date || new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };
  transactions.unshift(transaction);
  return transaction;
};

const deleteTransaction = (id) => {
  const index = transactions.findIndex((t) => t.id === id);
  if (index === -1) return null;
  const [removed] = transactions.splice(index, 1);
  return removed;
};

// --- Categories ---
const getCategories = () => [...categories];

const getCategoryById = (id) => categories.find((c) => c.id === id);

const addCategory = (data) => {
  const category = {
    id: uuidv4(),
    name: data.name,
    emoji: data.emoji || '📌',
    color: data.color || '#6366f1',
  };
  categories.push(category);
  return category;
};

const deleteCategory = (id) => {
  const index = categories.findIndex((c) => c.id === id);
  if (index === -1) return null;
  const [removed] = categories.splice(index, 1);
  return removed;
};

module.exports = {
  getTransactions,
  getTransactionById,
  addTransaction,
  deleteTransaction,
  getCategories,
  getCategoryById,
  addCategory,
  deleteCategory,
};
