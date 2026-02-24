const express = require('express');
const cors = require('cors');

const transactionRoutes = require('./routes/transactions');
const categoryRoutes = require('./routes/categories');
const aiRoutes = require('./routes/ai');

const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:4173', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST', 'DELETE'],
}));
app.use(express.json());

app.use('/api/transactions', transactionRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/ai', aiRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

module.exports = app;
