import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 35000,
  withCredentials: true,
});

// Attach CSRF token to every mutating request
let csrfToken = null;

export const refreshCsrfToken = async () => {
  const res = await api.get('/auth/csrf');
  csrfToken = res.data.csrfToken;
};

api.interceptors.request.use((config) => {
  const mutating = ['post', 'patch', 'put', 'delete'];
  if (mutating.includes(config.method) && csrfToken) {
    config.headers['x-csrf-token'] = csrfToken;
  }
  return config;
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

// Auth
export const fetchMe = () => api.get('/auth/me').then((r) => r.data);
export const logoutUser = () => api.post('/auth/logout').then((r) => r.data);
export const updateUserName = (name) => api.patch('/auth/name', { name }).then((r) => r.data);

export default api;
