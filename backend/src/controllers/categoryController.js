const storage = require('../services/storage');

const getCategories = (req, res) => {
  const categories = storage.getCategories();
  res.json(categories);
};

const createCategory = (req, res) => {
  const { name, emoji, color } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'name is required' });
  }
  const existing = storage.getCategories().find(
    (c) => c.name.toLowerCase() === name.trim().toLowerCase()
  );
  if (existing) {
    return res.status(409).json({ error: 'Category already exists' });
  }
  const category = storage.addCategory({ name: name.trim(), emoji, color });
  res.status(201).json(category);
};

const deleteCategory = (req, res) => {
  const { id } = req.params;
  const removed = storage.deleteCategory(id);
  if (!removed) {
    return res.status(404).json({ error: 'Category not found' });
  }
  res.json({ message: 'Category deleted', category: removed });
};

module.exports = { getCategories, createCategory, deleteCategory };
