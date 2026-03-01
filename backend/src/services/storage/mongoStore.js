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

/**
 * Seed default categories for a specific user (called once on first login).
 */
const seedCategoriesForUser = async (userId) => {
  const count = await Category.countDocuments({ userId });
  if (count === 0) {
    const docs = DEFAULT_CATEGORIES.map((c) => ({ ...c, userId }));
    await Category.insertMany(docs);
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

const getTransactionById = async (userId, id) => {
  const t = await Transaction.findOne({ _id: id, userId });
  if (!t) return null;
  return { id: t._id.toString(), ...t.toObject() };
};

const addTransaction = async (userId, data) => {
  const t = await Transaction.create({
    userId,
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

const deleteTransaction = async (userId, id) => {
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

const getCategoryById = async (userId, id) => {
  const c = await Category.findOne({ _id: id, userId });
  if (!c) return null;
  return { id: c._id.toString(), name: c.name, emoji: c.emoji, color: c.color };
};

const addCategory = async (userId, data) => {
  const c = await Category.create({
    userId,
    name: data.name,
    emoji: data.emoji || '📌',
    color: data.color || '#6366f1',
  });
  return { id: c._id.toString(), name: c.name, emoji: c.emoji, color: c.color };
};

const deleteCategory = async (userId, id) => {
  const c = await Category.findOneAndDelete({ _id: id, userId });
  if (!c) return null;
  return { id: c._id.toString(), name: c.name, emoji: c.emoji, color: c.color };
};

module.exports = {
  seedCategoriesForUser,
  getTransactions,
  getTransactionById,
  addTransaction,
  deleteTransaction,
  getCategories,
  getCategoryById,
  addCategory,
  deleteCategory,
};
