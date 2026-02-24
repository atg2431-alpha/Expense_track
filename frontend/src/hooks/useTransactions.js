import { useState, useEffect, useCallback } from 'react';
import * as api from '../services/api';

export function useTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);

  const loadTransactions = useCallback(async () => {
    setLoadingTransactions(true);
    try {
      const data = await api.fetchTransactions();
      setTransactions(data);
    } catch (err) {
      console.error('Failed to load transactions:', err);
    } finally {
      setLoadingTransactions(false);
    }
  }, []);

  const loadCategories = useCallback(async () => {
    setLoadingCategories(true);
    try {
      const data = await api.fetchCategories();
      setCategories(data);
    } catch (err) {
      console.error('Failed to load categories:', err);
    } finally {
      setLoadingCategories(false);
    }
  }, []);

  useEffect(() => {
    loadTransactions();
    loadCategories();
  }, [loadTransactions, loadCategories]);

  const addTransaction = useCallback(async (data) => {
    const tx = await api.createTransaction(data);
    setTransactions((prev) => [tx, ...prev]);
    return tx;
  }, []);

  const removeTransaction = useCallback(async (id) => {
    await api.deleteTransaction(id);
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addCategory = useCallback(async (data) => {
    const cat = await api.createCategory(data);
    setCategories((prev) => [...prev, cat]);
    return cat;
  }, []);

  const removeCategory = useCallback(async (id) => {
    await api.deleteCategory(id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }, []);

  // Derived totals
  const totals = transactions.reduce(
    (acc, t) => {
      if (t.type === 'income') acc.income += t.amount;
      else acc.expenses += t.amount;
      return acc;
    },
    { income: 0, expenses: 0 }
  );
  totals.balance = totals.income - totals.expenses;

  return {
    transactions,
    categories,
    loadingTransactions,
    loadingCategories,
    totals,
    addTransaction,
    removeTransaction,
    addCategory,
    removeCategory,
    reload: loadTransactions,
  };
}
