import { useState } from 'react';
import { Plus, Trash2, Palette } from 'lucide-react';
import Spinner from '../common/Spinner';

const PRESET_COLORS = [
  '#6366f1', '#8b5cf6', '#a855f7', '#ec4899', '#f43f5e',
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16',
  '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#3b82f6',
];

const PRESET_EMOJIS = ['🍔', '🚗', '🛍️', '🎬', '💊', '📄', '📦', '✈️', '🏠', '🎮', '📚', '🏋️', '💅', '🎁', '🐾'];

export default function CategoryManager({ categories, onAddCategory, onDeleteCategory }) {
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('📌');
  const [color, setColor] = useState('#6366f1');
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name.trim()) { setError('Category name is required'); return; }
    setError('');
    setLoading(true);
    try {
      await onAddCategory({ name: name.trim(), emoji, color });
      setName('');
      setEmoji('📌');
      setColor('#6366f1');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create category');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await onDeleteCategory(id);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-2xl font-bold text-white">Categories</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          {categories.length} categories · Organize your spending
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Add Form */}
        <div className="card p-6 lg:col-span-2">
          <h2 className="text-sm font-semibold text-slate-300 mb-4">Create New Category</h2>
          <form onSubmit={handleAdd} className="space-y-4">
            {/* Emoji picker */}
            <div>
              <label className="label">Emoji</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="w-full input-field text-left flex items-center gap-3"
                >
                  <span className="text-2xl">{emoji}</span>
                  <span className="text-slate-500">Click to choose emoji</span>
                </button>
                {showEmojiPicker && (
                  <div className="absolute top-full left-0 mt-2 z-10 bg-slate-800 border border-slate-700 rounded-2xl p-3 shadow-2xl">
                    <div className="grid grid-cols-5 gap-2">
                      {PRESET_EMOJIS.map((e) => (
                        <button
                          key={e}
                          type="button"
                          onClick={() => { setEmoji(e); setShowEmojiPicker(false); }}
                          className={`w-9 h-9 rounded-lg text-xl hover:bg-slate-700 transition-colors flex items-center justify-center
                            ${emoji === e ? 'bg-indigo-500/20 ring-1 ring-indigo-500' : ''}`}
                        >
                          {e}
                        </button>
                      ))}
                    </div>
                    <div className="mt-2 pt-2 border-t border-slate-700">
                      <input
                        type="text"
                        placeholder="Or type any emoji…"
                        value={emoji}
                        onChange={(e) => setEmoji(e.target.value)}
                        className="input-field py-1.5 text-xl text-center"
                        maxLength={2}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="label">Category Name</label>
              <input
                type="text"
                placeholder="e.g. Groceries, Gym…"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
                required
              />
            </div>

            {/* Color */}
            <div>
              <label className="label flex items-center gap-1"><Palette size={13} /> Color</label>
              <div className="grid grid-cols-8 gap-2">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`w-7 h-7 rounded-lg transition-transform hover:scale-110 ${
                      color === c ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-800 scale-110' : ''
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-6 h-6 rounded-md flex-shrink-0" style={{ backgroundColor: color }} />
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="input-field py-1 h-9 cursor-pointer"
                  title="Custom color"
                />
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2">
                {error}
              </p>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
              {loading ? <Spinner size={16} /> : <Plus size={16} />}
              {loading ? 'Creating…' : 'Create Category'}
            </button>
          </form>
        </div>

        {/* Category List */}
        <div className="card overflow-hidden lg:col-span-3">
          <div className="p-5 border-b border-slate-700/50">
            <h2 className="text-sm font-semibold text-slate-300">All Categories</h2>
          </div>
          {categories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <span className="text-4xl mb-3">🏷️</span>
              <p className="text-slate-500 text-sm">No categories yet</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-700/30">
              {categories.map((cat) => {
                const isDeleting = deletingId === cat.id;
                return (
                  <div
                    key={cat.id}
                    className={`flex items-center gap-4 px-5 py-3.5 group hover:bg-slate-700/20 transition-colors ${
                      isDeleting ? 'opacity-40' : ''
                    }`}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                      style={{ backgroundColor: cat.color + '20', border: `1px solid ${cat.color}40` }}
                    >
                      {cat.emoji}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-white text-sm">{cat.name}</p>
                      <p className="text-xs text-slate-500">{cat.color}</p>
                    </div>
                    <div
                      className="w-4 h-4 rounded-full flex-shrink-0"
                      style={{ backgroundColor: cat.color }}
                    />
                    <button
                      onClick={() => handleDelete(cat.id)}
                      disabled={isDeleting}
                      className="btn-danger opacity-0 group-hover:opacity-100 transition-all"
                    >
                      {isDeleting ? <Spinner size={14} /> : <Trash2 size={14} />}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
