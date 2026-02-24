import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 35000,
});

// Transactions
export const fetchTransactions = () => api.get('/transactions').then((r) => r.data);
export const createTransaction = (data) => api.post('/transactions', data).then((r) => r.data);
export const deleteTransaction = (id) => api.delete(`/transactions/${id}`).then((r) => r.data);

// Categories
export const fetchCategories = () => api.get('/categories').then((r) => r.data);
export const createCategory = (data) => api.post('/categories', data).then((r) => r.data);
export const deleteCategory = (id) => api.delete(`/categories/${id}`).then((r) => r.data);

// AI
export const parseAIText = (text) => api.post('/ai/parse', { text }).then((r) => r.data);

export default api;
