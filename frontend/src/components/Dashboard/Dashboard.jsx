import { useState } from 'react';
import { TrendingUp, TrendingDown, Wallet, Plus } from 'lucide-react';
import TransactionForm from '../TransactionForm/TransactionForm';
import Spinner from '../common/Spinner';

const fmt = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

const fmtDate = (d) =>
  new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

export default function Dashboard({ transactions, categories, totals, loading, onAddTransaction, onDeleteTransaction }) {
  const [showForm, setShowForm] = useState(false);

  const recent = transactions.slice(0, 5);

  // Spending by category
  const expensesByCategory = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  const sortedCategories = Object.entries(expensesByCategory)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const categoryMap = Object.fromEntries(categories.map((c) => [c.name, c]));

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Balance */}
        <div className="card p-6 sm:col-span-1 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none" />
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
              <Wallet size={18} className="text-indigo-400" />
            </div>
            <span className="text-xs text-slate-500 bg-slate-700/50 px-2 py-1 rounded-full">Total</span>
          </div>
          <p className="text-slate-400 text-sm mb-1">Balance</p>
          <p className={`text-3xl font-bold ${totals.balance >= 0 ? 'text-white' : 'text-red-400'}`}>
            {fmt(totals.balance)}
          </p>
          <p className="text-xs text-slate-500 mt-2">
            {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Income */}
        <div className="card p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none" />
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
              <TrendingUp size={18} className="text-emerald-400" />
            </div>
            <span className="text-xs text-emerald-500/70 bg-emerald-500/10 px-2 py-1 rounded-full">Income</span>
          </div>
          <p className="text-slate-400 text-sm mb-1">Total Income</p>
          <p className="text-3xl font-bold text-emerald-400">{fmt(totals.income)}</p>
          <p className="text-xs text-slate-500 mt-2">
            {transactions.filter((t) => t.type === 'income').length} transactions
          </p>
        </div>

        {/* Expenses */}
        <div className="card p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent pointer-events-none" />
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center">
              <TrendingDown size={18} className="text-red-400" />
            </div>
            <span className="text-xs text-red-500/70 bg-red-500/10 px-2 py-1 rounded-full">Expenses</span>
          </div>
          <p className="text-slate-400 text-sm mb-1">Total Expenses</p>
          <p className="text-3xl font-bold text-red-400">{fmt(totals.expenses)}</p>
          <p className="text-xs text-slate-500 mt-2">
            {transactions.filter((t) => t.type === 'expense').length} transactions
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Spending by Category */}
        <div className="card p-6 lg:col-span-2">
          <h2 className="text-sm font-semibold text-slate-300 mb-4">Spending by Category</h2>
          {sortedCategories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-slate-600">
              <span className="text-3xl mb-2">📊</span>
              <p className="text-sm">No expense data yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedCategories.map(([cat, amount]) => {
                const pct = totals.expenses > 0 ? (amount / totals.expenses) * 100 : 0;
                const catInfo = categoryMap[cat];
                return (
                  <div key={cat}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{catInfo?.emoji || '📦'}</span>
                        <span className="text-sm text-slate-300">{cat}</span>
                      </div>
                      <span className="text-sm font-semibold text-slate-200">{fmt(amount)}</span>
                    </div>
                    <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, backgroundColor: catInfo?.color || '#6366f1' }}
                      />
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">{pct.toFixed(1)}% of expenses</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Transactions */}
        <div className="card p-6 lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-300">Recent Transactions</h2>
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary text-xs py-1.5 px-3"
            >
              <Plus size={13} />
              Add
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-10"><Spinner /></div>
          ) : recent.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-slate-600">
              <span className="text-4xl mb-3">💸</span>
              <p className="text-sm font-medium text-slate-500">No transactions yet</p>
              <p className="text-xs text-slate-600 mt-1">Add your first transaction above</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recent.map((tx) => {
                const catInfo = categoryMap[tx.category];
                return (
                  <div
                    key={tx.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-slate-700/30 hover:bg-slate-700/50 transition-colors"
                  >
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-sm flex-shrink-0"
                      style={{ backgroundColor: (catInfo?.color || '#6366f1') + '20', border: `1px solid ${(catInfo?.color || '#6366f1')}30` }}
                    >
                      {catInfo?.emoji || '📦'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {tx.description || tx.category}
                      </p>
                      <p className="text-xs text-slate-500">
                        {tx.category} · {fmtDate(tx.date)}
                      </p>
                    </div>
                    <span className={tx.type === 'income' ? 'amount-income' : 'amount-expense'}>
                      {tx.type === 'income' ? '+' : '-'}{fmt(tx.amount)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md animate-slide-up">
            <TransactionForm
              categories={categories}
              onSubmit={async (data) => {
                await onAddTransaction(data);
                setShowForm(false);
              }}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
