import { useState, useCallback } from 'react';
import { LayoutDashboard, ArrowLeftRight, Tag, Sparkles } from 'lucide-react';
import { useAuth } from './context/AuthContext';
import { useTransactions } from './hooks/useTransactions';
import Dashboard from './components/Dashboard/Dashboard';
import TransactionList from './components/TransactionList/TransactionList';
import CategoryManager from './components/CategoryManager/CategoryManager';
import AIInput from './components/AIInput/AIInput';
import LoginPage from './components/Auth/LoginPage';
import UserMenu from './components/Auth/UserMenu';
import Toast from './components/common/Toast';

const TABS = [
  { id: 'dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', Icon: ArrowLeftRight },
  { id: 'categories', label: 'Categories', Icon: Tag },
  { id: 'ai', label: 'AI Input', Icon: Sparkles },
];

export default function App() {
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [toast, setToast] = useState(null);

  const {
    transactions,
    categories,
    loadingTransactions,
    totals,
    addTransaction,
    removeTransaction,
    addCategory,
    removeCategory,
  } = useTransactions();

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
  }, []);

  const handleAddTransaction = async (data) => {
    try {
      await addTransaction(data);
      showToast('Transaction added successfully!');
    } catch {
      showToast('Failed to add transaction', 'error');
    }
  };

  const handleDeleteTransaction = async (id) => {
    try {
      await removeTransaction(id);
      showToast('Transaction deleted');
    } catch {
      showToast('Failed to delete transaction', 'error');
    }
  };

  const handleAddCategory = async (data) => {
    try {
      await addCategory(data);
      showToast('Category created!');
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to create category', 'error');
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await removeCategory(id);
      showToast('Category deleted');
    } catch {
      showToast('Failed to delete category', 'error');
    }
  };

  const handleAIConfirm = async (data) => {
    await handleAddTransaction(data);
    setActiveTab('transactions');
  };

  // Auth loading spinner
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-[3px] border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  // Not logged in → show login page
  if (!user) {
    return <LoginPage />;
  }

  // Logged in → show the app
  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-lg">
                💰
              </div>
              <div>
                <h1 className="font-bold text-white text-lg leading-none">ExpenseAI</h1>
                <p className="text-xs text-slate-500 leading-none mt-0.5">
                  Hey, {user.name?.split(' ')[0]} 👋
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Balance pill */}
              <div className="hidden sm:flex items-center gap-2 bg-slate-800 border border-slate-700/50 rounded-full px-4 py-1.5">
                <span className="text-xs text-slate-400">Balance</span>
                <span className={`text-sm font-bold ${totals.balance >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {totals.balance >= 0 ? '+' : ''}{formatCurrency(totals.balance)}
                </span>
              </div>

              {/* User Menu */}
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="border-b border-slate-800 bg-slate-900/60 sticky top-16 z-30 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex gap-1 py-2">
            {TABS.map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${activeTab === id ? 'tab-active' : 'tab-inactive'
                  }`}
              >
                <Icon size={15} />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
        {activeTab === 'dashboard' && (
          <Dashboard
            transactions={transactions}
            categories={categories}
            totals={totals}
            loading={loadingTransactions}
            onAddTransaction={handleAddTransaction}
            onDeleteTransaction={handleDeleteTransaction}
          />
        )}
        {activeTab === 'transactions' && (
          <TransactionList
            transactions={transactions}
            categories={categories}
            loading={loadingTransactions}
            onAddTransaction={handleAddTransaction}
            onDeleteTransaction={handleDeleteTransaction}
          />
        )}
        {activeTab === 'categories' && (
          <CategoryManager
            categories={categories}
            onAddCategory={handleAddCategory}
            onDeleteCategory={handleDeleteCategory}
          />
        )}
        {activeTab === 'ai' && (
          <AIInput categories={categories} onConfirm={handleAIConfirm} />
        )}
      </main>

      {/* Toast notifications */}
      {toast && (
        <Toast key={toast.id} message={toast.message} type={toast.type} onDone={() => setToast(null)} />
      )}
    </div>
  );
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}
