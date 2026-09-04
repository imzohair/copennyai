import { Request, Response } from 'express';
import { query } from '../config/db';
import * as featherlessService from '../services/featherlessService';
import { emitToUser } from '../services/websocketService';
async function getUserContext(userId: number) {
  // Get last 50 transactions
  const txRes = await query('SELECT * FROM transactions WHERE user_id = $1 ORDER BY date DESC LIMIT 50', [userId]);
  const transactions = txRes.rows;

  // Calculate Total Income (All-time Credits)
  const incomeRes = await query(`
    SELECT SUM(amount) as total 
    FROM transactions 
    WHERE user_id = $1 AND type = 'credit'
  `, [userId]);
  const monthlyIncome = parseFloat(incomeRes.rows[0].total) || 0;

  // Calculate Total Expenses (All-time Debits)
  const expenseRes = await query(`
    SELECT SUM(amount) as total 
    FROM transactions 
    WHERE user_id = $1 AND type = 'debit'
  `, [userId]);
  const monthlyExpenses = parseFloat(expenseRes.rows[0].total) || 0;

  // Calculate Savings Rate
  let savingsRate = 0;
  if (monthlyIncome > 0) {
    savingsRate = ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100;
  }

  // Calculate Total Balance (all credits - all debits)
  const balanceRes = await query(`
    SELECT 
      SUM(CASE WHEN type = 'credit' THEN amount ELSE 0 END) - 
      SUM(CASE WHEN type = 'debit' THEN amount ELSE 0 END) as balance
    FROM transactions
    WHERE user_id = $1
  `, [userId]);
  const totalBalance = parseFloat(balanceRes.rows[0].balance) || 0;

  return {
    transactions,
    userContext: {
      monthlyIncome,
      monthlyExpenses,
      savingsRate: Math.max(0, savingsRate),
      totalBalance
    }
  };
}

export async function generateInsights(req: Request, res: Response) {
  try {
    const userId = (req as any).user.id;
    const { transactions, userContext } = await getUserContext(userId);
    
    const insights = await featherlessService.generateInsight(transactions, userContext);
    res.json({ insights });
  } catch (error) {
    console.error('Error in generateInsights:', error);
    res.status(500).json({ error: 'Failed to generate insights' });
  }
}

export async function generateActions(req: Request, res: Response) {
  try {
    const userId = (req as any).user.id;
    const { userContext } = await getUserContext(userId);
    
    // Fetch active subscriptions
    const subRes = await query("SELECT * FROM subscriptions WHERE user_id = $1 AND status = 'active'", [userId]);
    const subscriptions = subRes.rows;

    const actions = await featherlessService.generateAction(userContext, subscriptions);
    res.json({ actions });
  } catch (error) {
    console.error('Error in generateActions:', error);
    res.status(500).json({ error: 'Failed to generate actions' });
  }
}

export async function explainInsight(req: Request, res: Response) {
  try {
    const { insight } = req.body;
    if (!insight) {
      res.status(400).json({ error: 'Insight object is required' });
      return;
    }

    const explanation = await featherlessService.explainReasoning(insight);
    res.json({ explanation });
  } catch (error) {
    console.error('Error in explainInsight:', error);
    res.status(500).json({ error: 'Failed to explain insight' });
  }
}

export async function classifyTransaction(req: Request, res: Response) {
  try {
    const { description, amount } = req.body;
    if (!description || typeof amount !== 'number') {
      res.status(400).json({ error: 'Valid description and amount are required' });
      return;
    }

    const category = await featherlessService.classifyTransaction(description, amount);
    res.json({ category });
  } catch (error) {
    console.error('Error in classifyTransaction:', error);
    res.status(500).json({ error: 'Failed to classify transaction' });
  }
}

export async function executeAction(req: Request, res: Response) {
  try {
    const userId = (req as any).user.id;
    const { actionId } = req.body;
    
    if (!actionId) {
      res.status(400).json({ error: 'Action ID is required' });
      return;
    }

    // In a real app, we would look up the action type and perform the db mutation.
    // For now, just log and acknowledge.
    console.log(`User ${userId} executed action: ${actionId}`);
    
    // Notify the user in real-time
    emitToUser(userId, 'action-complete', { actionId });
    
    res.json({ success: true, message: `Action ${actionId} executed successfully.` });
  } catch (error) {
    console.error('Error in executeAction:', error);
    res.status(500).json({ error: 'Failed to execute action' });
  }
}

export async function chatQuery(req: Request, res: Response) {
  try {
    const userId = (req as any).user.id;
    const { query, history = [] } = req.body;

    if (!query) {
      res.status(400).json({ error: 'Query is required' });
      return;
    }

    const { userContext } = await getUserContext(userId);
    const responseText = await featherlessService.processChatQuery(query, history, userContext);
    
    res.json({ response: responseText });
  } catch (error) {
    console.error('Error in chatQuery:', error);
    res.status(500).json({ error: 'Failed to process chat query' });
  }
}
