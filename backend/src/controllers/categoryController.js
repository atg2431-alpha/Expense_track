const storage = require('../services/storage');

const getCategories = async (req, res) => {
  const categories = await storage.getCategories();
  res.json(categories);
};

const createCategory = async (req, res) => {
  const { name, emoji, color } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'name is required' });
  }
  try {
    const category = await storage.addCategory({ name: name.trim(), emoji, color });
    res.status(201).json(category);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'Category already exists' });
    }
    res.status(500).json({ error: err.message });
  }
};

const deleteCategory = async (req, res) => {
  const { id } = req.params;
  const removed = await storage.deleteCategory(id);
  if (!removed) {
    return res.status(404).json({ error: 'Category not found' });
  }
  res.json({ message: 'Category deleted', category: removed });
};

module.exports = { getCategories, createCategory, deleteCategory };
