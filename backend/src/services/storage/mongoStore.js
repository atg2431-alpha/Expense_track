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

const seedUserCategories = async (userId) => {
  const count = await Category.countDocuments({ userId });
  if (count === 0) {
    await Category.insertMany(DEFAULT_CATEGORIES.map((c) => ({ ...c, userId })));
  }
};

// --- Transactions ---
const getTransactions = async (userId) => {
  const txs = await Transaction.find({ userId }).sort({ createdAt: -1 });
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

const getTransactionById = async (id, userId) => {
  const t = await Transaction.findOne({ _id: id, userId });
  if (!t) return null;
  return { id: t._id.toString(), ...t.toObject() };
};

const addTransaction = async (data) => {
  const t = await Transaction.create({
    userId: data.userId,
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

const deleteTransaction = async (id, userId) => {
  const t = await Transaction.findOneAndDelete({ _id: id, userId });
  if (!t) return null;
  return { id: t._id.toString(), ...t.toObject() };
};

// --- Categories ---
const getCategories = async (userId) => {
  const cats = await Category.find({ userId });
  return cats.map((c) => ({
    id: c._id.toString(),
    name: c.name,
    emoji: c.emoji,
    color: c.color,
  }));
};

const getCategoryById = async (id, userId) => {
  const c = await Category.findOne({ _id: id, userId });
  if (!c) return null;
  return { id: c._id.toString(), name: c.name, emoji: c.emoji, color: c.color };
};

const addCategory = async (data) => {
  const c = await Category.create({
    userId: data.userId,
    name: data.name,
    emoji: data.emoji || '📌',
    color: data.color || '#6366f1',
  });
  return { id: c._id.toString(), name: c.name, emoji: c.emoji, color: c.color };
};

const deleteCategory = async (id, userId) => {
  const c = await Category.findOneAndDelete({ _id: id, userId });
  if (!c) return null;
  return { id: c._id.toString(), name: c.name, emoji: c.emoji, color: c.color };
};

module.exports = {
  seedUserCategories,
  getTransactions,
  getTransactionById,
  addTransaction,
  deleteTransaction,
  getCategories,
  getCategoryById,
  addCategory,
  deleteCategory,
};
