import { useState } from 'react';
import { X, DollarSign, Calendar, AlignLeft, Tag } from 'lucide-react';
import Spinner from '../common/Spinner';

export default function TransactionForm({ categories, onSubmit, onCancel, initialData = {} }) {
  const [type, setType] = useState(initialData.type || 'expense');
  const [amount, setAmount] = useState(initialData.amount || '');
  const [category, setCategory] = useState(initialData.category || (categories[0]?.name || ''));
  const [description, setDescription] = useState(initialData.description || '');
  const [date, setDate] = useState(
    initialData.date
      ? new Date(initialData.date).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0]
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    setLoading(true);
    try {
      await onSubmit({ type, amount: parseFloat(amount), category, description, date });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save transaction');
    } finally {
      setLoading(false);
    }
  };

  const expenseCategories = categories;
  const incomeCategories = [
    { name: 'Salary', emoji: '💼', color: '#10b981' },
    { name: 'Freelance', emoji: '💻', color: '#6366f1' },
    { name: 'Investment', emoji: '📈', color: '#f59e0b' },
    { name: 'Gift', emoji: '🎁', color: '#ec4899' },
    ...categories,
  ];
  const displayCategories = type === 'income' ? incomeCategories : expenseCategories;

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-white">Add Transaction</h2>
        {onCancel && (
          <button onClick={onCancel} className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-700">
            <X size={18} />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type Toggle */}
        <div className="flex gap-2 p-1 bg-slate-900 rounded-xl">
          {['expense', 'income'].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                type === t
                  ? t === 'income'
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                    : 'bg-red-500 text-white shadow-lg shadow-red-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t === 'income' ? '💰 Income' : '💸 Expense'}
            </button>
          ))}
        </div>

        {/* Amount */}
        <div>
          <label className="label">Amount</label>
          <div className="relative">
            <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input-field pl-9"
              required
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="label flex items-center gap-1">
            <Tag size={13} />
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input-field"
          >
            {displayCategories.map((c) => (
              <option key={c.name} value={c.name}>
                {c.emoji} {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="label flex items-center gap-1">
            <AlignLeft size={13} />
            Description <span className="text-slate-600">(optional)</span>
          </label>
          <input
            type="text"
            placeholder="What was this for?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input-field"
          />
        </div>

        {/* Date */}
        <div>
          <label className="label flex items-center gap-1">
            <Calendar size={13} />
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="input-field"
          />
        </div>

        {error && (
          <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2">
            {error}
          </p>
        )}

        <div className="flex gap-3 pt-2">
          {onCancel && (
            <button type="button" onClick={onCancel} className="btn-secondary flex-1 justify-center">
              Cancel
            </button>
          )}
          <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center">
            {loading ? <Spinner size={16} /> : null}
            {loading ? 'Saving…' : 'Add Transaction'}
          </button>
        </div>
      </form>
    </div>
  );
}
