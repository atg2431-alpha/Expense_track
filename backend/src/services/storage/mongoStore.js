const Transaction = require('../../models/Transaction');
const Category = require('../../models/Category');

const DEFAULT_CATEGORIES = [
  { name: 'Food', emoji: '🍔', color: '#f97316' },
  { name: 'Transport', emoji: '🚗', color: '#3b82f6' },
  { name: 'Shopping', emoji: '🛍️', color: '#a855f7' },
  { name: 'Entertainment', emoji: '🎬', color: '#ec4899' },
  { name: 'Health', emoji: '💊', color: '#10b981' },
  { name: 'Bills', emoji: '📄', color: '#f59e0b' },
  { name: 'Other', emoji: '📦', color: '#6b7280' },
];

async function seedCategories() {
  const count = await Category.countDocuments();
  if (count === 0) {
    await Category.insertMany(DEFAULT_CATEGORIES);
  }
}

// Call once on startup
seedCategories().catch((err) => console.error('Failed to seed categories:', err));

// --- Transactions ---
const getTransactions = async () => {
  const txs = await Transaction.find().sort({ createdAt: -1 });
  return txs.map((t) => ({
    id: t._id.toString(),
    type: t.type,
    amount: t.amount,
    category: t.category,
    description: t.description,
    date: t.date.toISOString(),
    createdAt: t.createdAt.toISOString(),
  }));
};

const getTransactionById = async (id) => {
  const t = await Transaction.findById(id);
  if (!t) return null;
  return { id: t._id.toString(), ...t.toObject() };
};

const addTransaction = async (data) => {
  const t = await Transaction.create({
    type: data.type,
    amount: parseFloat(data.amount),
    category: data.category || 'Other',
    description: data.description || '',
    date: data.date || new Date(),
  });
  return {
    id: t._id.toString(),
    type: t.type,
    amount: t.amount,
    category: t.category,
    description: t.description,
    date: t.date.toISOString(),
    createdAt: t.createdAt.toISOString(),
  };
};

const deleteTransaction = async (id) => {
  const t = await Transaction.findByIdAndDelete(id);
  if (!t) return null;
  return { id: t._id.toString(), ...t.toObject() };
};

// --- Categories ---
const getCategories = async () => {
  const cats = await Category.find();
  return cats.map((c) => ({
    id: c._id.toString(),
    name: c.name,
    emoji: c.emoji,
    color: c.color,
  }));
};

const getCategoryById = async (id) => {
  const c = await Category.findById(id);
  if (!c) return null;
  return { id: c._id.toString(), name: c.name, emoji: c.emoji, color: c.color };
};

const addCategory = async (data) => {
  const c = await Category.create({
    name: data.name,
    emoji: data.emoji || '📌',
    color: data.color || '#6366f1',
  });
  return { id: c._id.toString(), name: c.name, emoji: c.emoji, color: c.color };
};

const deleteCategory = async (id) => {
  const c = await Category.findByIdAndDelete(id);
  if (!c) return null;
  return { id: c._id.toString(), name: c.name, emoji: c.emoji, color: c.color };
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
