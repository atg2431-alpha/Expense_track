const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['income', 'expense'], required: true },
    amount: { type: Number, required: true },
    category: { type: String, default: 'Other' },
    description: { type: String, default: '' },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Transaction', transactionSchema);
