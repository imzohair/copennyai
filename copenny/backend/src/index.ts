// MUST be first: loads .env before any module reads process.env
import './env';

import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import transactionRoutes from './routes/transactionRoutes';
import goalRoutes from './routes/goalRoutes';
import subscriptionRoutes from './routes/subscriptionRoutes';
import budgetRoutes from './routes/budgetRoutes';
import chatRoutes from './routes/chatRoutes';
import ruleRoutes from './routes/ruleRoutes';
import { errorHandler } from './middleware/errorHandler';
import cron from 'node-cron';
import { query } from './config/db';
import { detectSubscriptions } from './services/subscriptionService';
import { evaluateRules } from './services/ruleEngineService';
import http from 'http';
import { initializeWebSocket } from './services/websocketService';


const app = express();
const PORT = process.env.PORT || 5000;

// Allow requests from any origin with Authorization headers
app.use(cors({
  origin: true,              // Reflect the request origin (allows all)
  credentials: true,         // Allow cookies and Authorization headers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.options('/{*splat}', cors()); // Handle preflight for all routes (Express 5 / path-to-regexp v8+)
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Copenny API is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/rules', ruleRoutes);

// Health check endpoint for Render
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Background Cron Jobs
cron.schedule('0 0 * * *', async () => {
  console.log('Running daily background jobs...');
  try {
    const usersRes = await query('SELECT id FROM users');
    const users = usersRes.rows;

    for (const user of users) {
      const userId = user.id;
      // 1. Detect new subscriptions
      await detectSubscriptions(userId);
      // 2. Evaluate all financial rules
      await evaluateRules(userId);
    }
    console.log('Daily background jobs completed successfully.');
  } catch (err) {
    console.error('Error running background jobs:', err);
  }
});

// Error Handler Middleware (must be registered last)
app.use(errorHandler);

const server = http.createServer(app);

// Initialize WebSockets
initializeWebSocket(server);

server.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
