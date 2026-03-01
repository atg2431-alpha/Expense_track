const storage = require('../services/storage');

const getTransactions = async (req, res) => {
  const transactions = await storage.getTransactions(req.userId);
  res.json(transactions);
};

const createTransaction = async (req, res) => {
  const { type, amount, category, description, date } = req.body;

  if (!type || !amount) {
    return res.status(400).json({ error: 'type and amount are required' });
  }
  if (!['income', 'expense'].includes(type)) {
    return res.status(400).json({ error: 'type must be "income" or "expense"' });
  }
  if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
    return res.status(400).json({ error: 'amount must be a positive number' });
  }

  try {
    const transaction = await storage.addTransaction(req.userId, { type, amount, category, description, date });
    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteTransaction = async (req, res) => {
  const { id } = req.params;
  const removed = await storage.deleteTransaction(req.userId, id);
  if (!removed) {
    return res.status(404).json({ error: 'Transaction not found' });
  }
  res.json({ message: 'Transaction deleted', transaction: removed });
};

module.exports = { getTransactions, createTransaction, deleteTransaction };
