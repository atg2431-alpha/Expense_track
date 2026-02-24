import { useState } from 'react';
import { Sparkles, Send, Check, Edit3, AlertTriangle, WifiOff } from 'lucide-react';
import { parseAIText } from '../../services/api';
import Spinner from '../common/Spinner';

const fmt = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

const fmtDate = (d) =>
  new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const EXAMPLES = [
  "Spent $45 on groceries yesterday",
  "Got paid $2000 salary today",
  "Paid $120 for electricity bill",
  "Grabbed coffee for $6.50 this morning",
  "Received $500 freelance payment",
];

export default function AIInput({ categories, onConfirm }) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [parsed, setParsed] = useState(null);
  const [error, setError] = useState(null);
  const [confirmed, setConfirmed] = useState(false);

  // Editable fields for parsed preview
  const [editType, setEditType] = useState('expense');
  const [editAmount, setEditAmount] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editDate, setEditDate] = useState('');

  const handleParse = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError(null);
    setParsed(null);
    setConfirmed(false);

    try {
      const result = await parseAIText(text);
      setParsed(result);
      setEditType(result.type);
      setEditAmount(String(result.amount));
      setEditCategory(result.category);
      setEditDescription(result.description);
      setEditDate(new Date(result.date).toISOString().split('T')[0]);
    } catch (err) {
      const detail = err.response?.data?.detail || err.response?.data?.error;
      const isOffline =
        err.response?.status === 503 ||
        err.message?.includes('Network Error') ||
        err.message?.includes('timeout');
      setError({ message: detail || err.message, isOffline });
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    await onConfirm({
      type: editType,
      amount: parseFloat(editAmount),
      category: editCategory,
      description: editDescription,
      date: editDate,
    });
    setConfirmed(true);
    setTimeout(() => {
      setText('');
      setParsed(null);
      setConfirmed(false);
    }, 1500);
  };

  const categoryMap = Object.fromEntries(categories.map((c) => [c.name, c]));
  const catInfo = parsed ? categoryMap[editCategory] : null;

  const allCategories = [
    { name: 'Salary', emoji: '💼' },
    { name: 'Freelance', emoji: '💻' },
    { name: 'Investment', emoji: '📈' },
    { name: 'Gift', emoji: '🎁' },
    ...categories,
  ];

  return (
    <div className="space-y-6 animate-slide-up max-w-2xl mx-auto">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-3xl mx-auto mb-4">
          <Sparkles className="text-indigo-400" size={28} />
        </div>
        <h1 className="text-2xl font-bold text-white">AI Input</h1>
        <p className="text-slate-400 text-sm mt-2">
          Describe a transaction in plain English — the AI will parse it for you
        </p>
      </div>

      {/* Input area */}
      <div className="card p-6 space-y-4">
        <div>
          <label className="label text-base">Describe your transaction</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleParse();
            }}
            placeholder={`e.g. "${EXAMPLES[0]}"`}
            rows={4}
            className="input-field resize-none text-base leading-relaxed"
          />
          <p className="text-xs text-slate-600 mt-1">Press Ctrl+Enter to parse</p>
        </div>

        {/* Example pills */}
        <div>
          <p className="text-xs text-slate-600 mb-2">Examples:</p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => setText(ex)}
                className="text-xs text-slate-400 hover:text-white bg-slate-700/50 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 px-3 py-1.5 rounded-full transition-all"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleParse}
          disabled={loading || !text.trim()}
          className="btn-primary w-full justify-center py-3 text-base"
        >
          {loading ? <Spinner size={18} /> : <Send size={18} />}
          {loading ? 'Parsing with AI…' : 'Parse with AI'}
        </button>
      </div>

      {/* Error state */}
      {error && (
        <div className="card p-6 border-red-500/20 bg-red-500/5 animate-slide-up">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center flex-shrink-0">
              {error.isOffline ? (
                <WifiOff size={18} className="text-red-400" />
              ) : (
                <AlertTriangle size={18} className="text-red-400" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-red-300 mb-1">
                {error.isOffline ? 'Ollama Not Running' : 'Parse Failed'}
              </h3>
              {error.isOffline ? (
                <div className="text-sm text-slate-400 space-y-1">
                  <p>Make sure Ollama is running locally:</p>
                  <code className="block bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-indigo-300 font-mono">
                    ollama serve
                  </code>
                  <code className="block bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-indigo-300 font-mono">
                    ollama pull llama3.2
                  </code>
                </div>
              ) : (
                <p className="text-sm text-slate-400">{error.message}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Parsed preview */}
      {parsed && !confirmed && (
        <div className="card p-6 border-indigo-500/20 bg-indigo-500/5 animate-slide-up">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            <h3 className="font-semibold text-indigo-300 text-sm">AI Parsed Result — Review & Edit</h3>
          </div>

          <div className="space-y-3">
            {/* Type toggle */}
            <div className="flex gap-2 p-1 bg-slate-900 rounded-xl">
              {['expense', 'income'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setEditType(t)}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                    editType === t
                      ? t === 'income'
                        ? 'bg-emerald-500 text-white'
                        : 'bg-red-500 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t === 'income' ? '💰 Income' : '💸 Expense'}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Amount */}
              <div>
                <label className="label">Amount</label>
                <input
                  type="number"
                  value={editAmount}
                  onChange={(e) => setEditAmount(e.target.value)}
                  className="input-field"
                  step="0.01"
                  min="0"
                />
              </div>

              {/* Date */}
              <div>
                <label className="label">Date</label>
                <input
                  type="date"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="label">Category</label>
              <select
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
                className="input-field"
              >
                {allCategories.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.emoji} {c.name}
                  </option>
                ))}
                {/* If parsed category isn't in list, add it */}
                {!allCategories.find((c) => c.name === editCategory) && (
                  <option value={editCategory}>📦 {editCategory}</option>
                )}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="label">Description</label>
              <input
                type="text"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="input-field"
              />
            </div>

            {/* Summary */}
            <div className="bg-slate-900 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{catInfo?.emoji || '📦'}</span>
                <div>
                  <p className="font-semibold text-white text-sm">{editDescription || editCategory}</p>
                  <p className="text-xs text-slate-500">{editCategory} · {fmtDate(editDate)}</p>
                </div>
              </div>
              <span className={`text-lg font-bold ${editType === 'income' ? 'text-emerald-400' : 'text-red-400'}`}>
                {editType === 'income' ? '+' : '-'}{fmt(parseFloat(editAmount) || 0)}
              </span>
            </div>
          </div>

          <div className="flex gap-3 mt-5">
            <button
              onClick={() => { setParsed(null); setError(null); }}
              className="btn-secondary flex-1 justify-center"
            >
              <Edit3 size={16} />
              Re-enter
            </button>
            <button onClick={handleConfirm} className="btn-primary flex-1 justify-center">
              <Check size={16} />
              Confirm & Add
            </button>
          </div>
        </div>
      )}

      {/* Confirmed state */}
      {confirmed && (
        <div className="card p-6 border-emerald-500/20 bg-emerald-500/5 animate-slide-up text-center">
          <div className="text-4xl mb-2">✅</div>
          <p className="text-emerald-300 font-semibold">Transaction added!</p>
          <p className="text-slate-500 text-sm mt-1">Redirecting to transactions…</p>
        </div>
      )}
    </div>
  );
}
