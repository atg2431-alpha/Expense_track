const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  emoji: { type: String, default: '📌' },
  color: { type: String, default: '#6366f1' },
});

module.exports = mongoose.model('Category', categorySchema);
