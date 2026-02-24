import { useState, useMemo } from 'react';
import { Trash2, Search, Plus, SlidersHorizontal, X } from 'lucide-react';
import TransactionForm from '../TransactionForm/TransactionForm';
import Spinner from '../common/Spinner';

const fmt = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

const fmtDate = (d) =>
  new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

export default function TransactionList({
  transactions,
  categories,
  loading,
  onAddTransaction,
  onDeleteTransaction,
}) {
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [deletingId, setDeletingId] = useState(null);

  const categoryMap = Object.fromEntries(categories.map((c) => [c.name, c]));

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const matchSearch =
        !search ||
        t.description?.toLowerCase().includes(search.toLowerCase()) ||
        t.category?.toLowerCase().includes(search.toLowerCase());
      const matchType = filterType === 'all' || t.type === filterType;
      const matchCat = filterCategory === 'all' || t.category === filterCategory;
      return matchSearch && matchType && matchCat;
    });
  }, [transactions, search, filterType, filterCategory]);

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await onDeleteTransaction(id);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Transactions</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {filtered.length} of {transactions.length} transactions
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? 'Cancel' : 'Add New'}
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="animate-slide-up">
          <TransactionForm
            categories={categories}
            onSubmit={async (data) => {
              await onAddTransaction(data);
              setShowForm(false);
            }}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-wrap gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-48">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search transactions…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-9 py-2"
            />
          </div>

          {/* Type filter */}
          <div className="flex items-center gap-1 bg-slate-900 rounded-xl p-1">
            {['all', 'income', 'expense'].map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  filterType === t
                    ? 'bg-indigo-500 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {/* Category filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="input-field py-2 w-auto min-w-36"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.emoji} {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* List */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><Spinner size={28} /></div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <span className="text-5xl mb-4">🔍</span>
            <p className="text-slate-400 font-medium">No transactions found</p>
            <p className="text-slate-600 text-sm mt-1">
              {transactions.length === 0 ? 'Add your first transaction!' : 'Try adjusting your filters'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-700/50">
            {filtered.map((tx, idx) => {
              const catInfo = categoryMap[tx.category];
              const isDeleting = deletingId === tx.id;
              return (
                <div
                  key={tx.id}
                  className={`flex items-center gap-4 px-5 py-4 transition-all duration-200
                    hover:bg-slate-700/20 group ${isDeleting ? 'opacity-40' : ''}`}
                >
                  {/* Category icon */}
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                    style={{
                      backgroundColor: (catInfo?.color || '#6366f1') + '20',
                      border: `1px solid ${(catInfo?.color || '#6366f1')}30`,
                    }}
                  >
                    {catInfo?.emoji || '📦'}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">
                      {tx.description || tx.category}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: (catInfo?.color || '#6366f1') + '20',
                          color: catInfo?.color || '#6366f1',
                        }}
                      >
                        {tx.category}
                      </span>
                      <span className="text-xs text-slate-500">{fmtDate(tx.date)}</span>
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="text-right flex-shrink-0">
                    <p className={`text-sm font-bold ${tx.type === 'income' ? 'text-emerald-400' : 'text-red-400'}`}>
                      {tx.type === 'income' ? '+' : '-'}{fmt(tx.amount)}
                    </p>
                    <p className="text-xs text-slate-600 capitalize">{tx.type}</p>
                  </div>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(tx.id)}
                    disabled={isDeleting}
                    className="btn-danger opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
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
  );
}
