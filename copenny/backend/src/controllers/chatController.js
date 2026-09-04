"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateInsights = generateInsights;
exports.generateActions = generateActions;
exports.explainInsight = explainInsight;
exports.classifyTransaction = classifyTransaction;
exports.executeAction = executeAction;
const db_1 = require("../config/db");
const featherlessService = __importStar(require("../services/featherlessService"));
// Helper to get raw aggregates using pg
async function getUserContext(userId) {
    // Get last 50 transactions
    const txRes = await (0, db_1.query)('SELECT * FROM transactions WHERE user_id = $1 ORDER BY date DESC LIMIT 50', [userId]);
    const transactions = txRes.rows;
    // Calculate Monthly Income (Credits in current month)
    const incomeRes = await (0, db_1.query)(`
    SELECT SUM(amount) as total 
    FROM transactions 
    WHERE user_id = $1 AND type = 'CREDIT' 
    AND date_trunc('month', date) = date_trunc('month', CURRENT_DATE)
  `, [userId]);
    const monthlyIncome = parseFloat(incomeRes.rows[0].total) || 0;
    // Calculate Monthly Expenses (Debits in current month)
    const expenseRes = await (0, db_1.query)(`
    SELECT SUM(amount) as total 
    FROM transactions 
    WHERE user_id = $1 AND type = 'DEBIT' 
    AND date_trunc('month', date) = date_trunc('month', CURRENT_DATE)
  `, [userId]);
    const monthlyExpenses = parseFloat(expenseRes.rows[0].total) || 0;
    // Calculate Savings Rate
    let savingsRate = 0;
    if (monthlyIncome > 0) {
        savingsRate = ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100;
    }
    // Calculate Total Balance (all credits - all debits)
    const balanceRes = await (0, db_1.query)(`
    SELECT 
      SUM(CASE WHEN type = 'CREDIT' THEN amount ELSE 0 END) - 
      SUM(CASE WHEN type = 'DEBIT' THEN amount ELSE 0 END) as balance
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
async function generateInsights(req, res) {
    try {
        const userId = req.user.userId;
        const { transactions, userContext } = await getUserContext(userId);
        const insights = await featherlessService.generateInsight(transactions, userContext);
        res.json({ insights });
    }
    catch (error) {
        console.error('Error in generateInsights:', error);
        res.status(500).json({ error: 'Failed to generate insights' });
    }
}
async function generateActions(req, res) {
    try {
        const userId = req.user.userId;
        const { userContext } = await getUserContext(userId);
        // Fetch active subscriptions
        const subRes = await (0, db_1.query)("SELECT * FROM subscriptions WHERE user_id = $1 AND status = 'active'", [userId]);
        const subscriptions = subRes.rows;
        const actions = await featherlessService.generateAction(userContext, subscriptions);
        res.json({ actions });
    }
    catch (error) {
        console.error('Error in generateActions:', error);
        res.status(500).json({ error: 'Failed to generate actions' });
    }
}
async function explainInsight(req, res) {
    try {
        const { insight } = req.body;
        if (!insight) {
            res.status(400).json({ error: 'Insight object is required' });
            return;
        }
        const explanation = await featherlessService.explainReasoning(insight);
        res.json({ explanation });
    }
    catch (error) {
        console.error('Error in explainInsight:', error);
        res.status(500).json({ error: 'Failed to explain insight' });
    }
}
async function classifyTransaction(req, res) {
    try {
        const { description, amount } = req.body;
        if (!description || typeof amount !== 'number') {
            res.status(400).json({ error: 'Valid description and amount are required' });
            return;
        }
        const category = await featherlessService.classifyTransaction(description, amount);
        res.json({ category });
    }
    catch (error) {
        console.error('Error in classifyTransaction:', error);
        res.status(500).json({ error: 'Failed to classify transaction' });
    }
}
async function executeAction(req, res) {
    try {
        const userId = req.user.userId;
        const { actionId } = req.body;
        if (!actionId) {
            res.status(400).json({ error: 'Action ID is required' });
            return;
        }
        // In a real app, we would look up the action type and perform the db mutation.
        // For now, just log and acknowledge.
        console.log(`User ${userId} executed action: ${actionId}`);
        res.json({ success: true, message: `Action ${actionId} executed successfully.` });
    }
    catch (error) {
        console.error('Error in executeAction:', error);
        res.status(500).json({ error: 'Failed to execute action' });
    }
}
//# sourceMappingURL=chatController.js.map