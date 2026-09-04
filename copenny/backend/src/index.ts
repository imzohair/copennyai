import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import transactionRoutes from './routes/transactionRoutes';
import goalRoutes from './routes/goalRoutes';
import subscriptionRoutes from './routes/subscriptionRoutes';
import budgetRoutes from './routes/budgetRoutes';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
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

// Error Handler Middleware (must be registered last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
