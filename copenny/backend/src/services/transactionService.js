"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CATEGORIES = void 0;
exports.categorizeTransaction = categorizeTransaction;
exports.ensureTransactionsTable = ensureTransactionsTable;
exports.getAllTransactions = getAllTransactions;
exports.getTransactionById = getTransactionById;
exports.createTransaction = createTransaction;
exports.updateTransaction = updateTransaction;
exports.deleteTransaction = deleteTransaction;
exports.importCSV = importCSV;
const db_1 = require("../config/db");
const sync_1 = require("csv-parse/sync");
// ─── Categories ────────────────────────────────────────────────────────────────
exports.CATEGORIES = [
    'Housing',
    'Food & Dining',
    'Transport',
    'Shopping',
    'Utilities',
    'Healthcare',
    'Entertainment',
    'Education',
    'Travel',
    'Investment',
    'Income',
    'Other',
];
// Keyword → Category mapping for auto-categorization
const CATEGORY_RULES = [
    { keywords: ['rent', 'mortgage', 'housing', 'apartment', 'flat', 'maintenance'], category: 'Housing' },
    { keywords: ['zomato', 'swiggy', 'restaurant', 'cafe', 'food', 'pizza', 'burger', 'dinner', 'lunch', 'breakfast', 'hotel', 'chai', 'tea', 'meal'], category: 'Food & Dining' },
    { keywords: ['uber', 'ola', 'petrol', 'diesel', 'fuel', 'metro', 'bus', 'auto', 'cab', 'train', 'flight', 'parking', 'toll', 'hp', 'bharat petroleum'], category: 'Transport' },
    { keywords: ['amazon', 'flipkart', 'myntra', 'ajio', 'meesho', 'shopping', 'clothes', 'shoes', 'order'], category: 'Shopping' },
    { keywords: ['electricity', 'water', 'gas', 'internet', 'broadband', 'mobile', 'recharge', 'jio', 'airtel', 'vi', 'bill', 'utility'], category: 'Utilities' },
    { keywords: ['hospital', 'doctor', 'clinic', 'medicine', 'pharmacy', 'apollo', 'medplus', 'health', 'medical', 'lab', 'diagnostic'], category: 'Healthcare' },
    { keywords: ['netflix', 'spotify', 'prime', 'hotstar', 'zee5', 'movie', 'cinema', 'pvr', 'inox', 'game', 'concert', 'gaming'], category: 'Entertainment' },
    { keywords: ['course', 'udemy', 'coursera', 'book', 'college', 'school', 'tuition', 'fees', 'exam', 'coaching', 'education'], category: 'Education' },
    { keywords: ['makemytrip', 'goibibo', 'irctc', 'hotel booking', 'holiday', 'trip', 'travel', 'airbnb', 'tour'], category: 'Travel' },
    { keywords: ['mutual fund', 'sip', 'stocks', 'zerodha', 'groww', 'nse', 'bse', 'fd', 'ppf', 'gold', 'investment', 'dividend'], category: 'Investment' },
    { keywords: ['salary', 'credit', 'income', 'bonus', 'incentive', 'freelance', 'consulting', 'refund', 'cashback'], category: 'Income' },
];
function categorizeTransaction(description) {
    const lower = description.toLowerCase();
    for (const rule of CATEGORY_RULES) {
        if (rule.keywords.some((kw) => lower.includes(kw))) {
            return rule.category;
        }
    }
    return 'Other';
}
// ─── DB Table Guarantee ─────────────────────────────────────────────────────────
async function ensureTransactionsTable() {
    await (0, db_1.query)(`
    CREATE TABLE IF NOT EXISTS transactions (
      id          SERIAL PRIMARY KEY,
      user_id     INTEGER NOT NULL,
      amount      NUMERIC(14, 2) NOT NULL,
      type        VARCHAR(10) NOT NULL CHECK (type IN ('credit', 'debit')),
      category    VARCHAR(50) NOT NULL DEFAULT 'Other',
      description TEXT NOT NULL,
      date        DATE NOT NULL DEFAULT CURRENT_DATE,
      notes       TEXT,
      created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
    CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
  `);
}
// ─── Service Methods ────────────────────────────────────────────────────────────
async function getAllTransactions(userId, filters = {}) {
    const { startDate, endDate, category, type, limit = 50, offset = 0 } = filters;
    const conditions = ['user_id = $1'];
    const params = [userId];
    let idx = 2;
    if (startDate) {
        conditions.push(`date >= $${idx++}`);
        params.push(startDate);
    }
    if (endDate) {
        conditions.push(`date <= $${idx++}`);
        params.push(endDate);
    }
    if (category) {
        conditions.push(`category = $${idx++}`);
        params.push(category);
    }
    if (type) {
        conditions.push(`type = $${idx++}`);
        params.push(type);
    }
    const where = conditions.join(' AND ');
    const [rowsResult, countResult] = await Promise.all([
        (0, db_1.query)(`SELECT * FROM transactions WHERE ${where} ORDER BY date DESC, created_at DESC LIMIT $${idx++} OFFSET $${idx++}`, [...params, limit, offset]),
        (0, db_1.query)(`SELECT COUNT(*) FROM transactions WHERE ${where}`, params),
    ]);
    return {
        transactions: rowsResult.rows,
        total: parseInt(countResult.rows[0].count, 10),
        limit,
        offset,
    };
}
async function getTransactionById(id, userId) {
    const result = await (0, db_1.query)('SELECT * FROM transactions WHERE id = $1 AND user_id = $2', [id, userId]);
    return result.rows[0] || null;
}
async function createTransaction(userId, data) {
    const category = data.category || categorizeTransaction(data.description);
    const date = data.date || new Date().toISOString().split('T')[0];
    const result = await (0, db_1.query)(`INSERT INTO transactions (user_id, amount, type, category, description, date, notes)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`, [userId, data.amount, data.type, category, data.description, date, data.notes ?? null]);
    return result.rows[0];
}
async function updateTransaction(id, userId, data) {
    // Fetch existing first to verify ownership
    const existing = await getTransactionById(id, userId);
    if (!existing)
        return null;
    const fields = [];
    const params = [];
    let idx = 1;
    if (data.amount !== undefined) {
        fields.push(`amount = $${idx++}`);
        params.push(data.amount);
    }
    if (data.type !== undefined) {
        fields.push(`type = $${idx++}`);
        params.push(data.type);
    }
    if (data.category !== undefined) {
        fields.push(`category = $${idx++}`);
        params.push(data.category);
    }
    if (data.description !== undefined) {
        fields.push(`description = $${idx++}`);
        params.push(data.description);
    }
    if (data.date !== undefined) {
        fields.push(`date = $${idx++}`);
        params.push(data.date);
    }
    if (data.notes !== undefined) {
        fields.push(`notes = $${idx++}`);
        params.push(data.notes);
    }
    if (fields.length === 0)
        return existing;
    fields.push(`updated_at = NOW()`);
    params.push(id, userId);
    const result = await (0, db_1.query)(`UPDATE transactions SET ${fields.join(', ')} WHERE id = $${idx++} AND user_id = $${idx++} RETURNING *`, params);
    return result.rows[0];
}
async function deleteTransaction(id, userId) {
    const result = await (0, db_1.query)('DELETE FROM transactions WHERE id = $1 AND user_id = $2 RETURNING id', [id, userId]);
    return result.rows.length > 0;
}
async function importCSV(userId, fileBuffer) {
    const rows = (0, sync_1.parse)(fileBuffer, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
    });
    let imported = 0;
    const errors = [];
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        if (!row)
            continue;
        try {
            const amount = parseFloat(row.amount ?? '');
            if (isNaN(amount) || amount <= 0) {
                errors.push(`Row ${i + 2}: Invalid amount "${row.amount ?? ''}"`);
                continue;
            }
            const type = (row.type?.toLowerCase() === 'credit') ? 'credit' : 'debit';
            const description = row.description?.trim();
            if (!description) {
                errors.push(`Row ${i + 2}: Missing description`);
                continue;
            }
            const date = row.date?.trim() || new Date().toISOString().split('T')[0];
            const category = row.category?.trim() || categorizeTransaction(description);
            await (0, db_1.query)(`INSERT INTO transactions (user_id, amount, type, category, description, date, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`, [userId, amount, type, category, description, date, row.notes ?? null]);
            imported++;
        }
        catch (err) {
            errors.push(`Row ${i + 2}: ${err.message}`);
        }
    }
    return { imported, errors };
}
//# sourceMappingURL=transactionService.js.map