import { query } from '../config/db';
import { parse } from 'csv-parse/sync';

// ─── Categories ────────────────────────────────────────────────────────────────

export const CATEGORIES = [
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
] as const;

export type Category = typeof CATEGORIES[number];

// Keyword → Category mapping for auto-categorization
const CATEGORY_RULES: { keywords: string[]; category: Category }[] = [
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

export function categorizeTransaction(description: string): Category {
  const lower = description.toLowerCase();
  for (const rule of CATEGORY_RULES) {
    if (rule.keywords.some((kw) => lower.includes(kw))) {
      return rule.category;
    }
  }
  return 'Other';
}

// ─── DB Table Guarantee ─────────────────────────────────────────────────────────

export async function ensureTransactionsTable() {
  await query(`
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

// ─── Filters Interface ─────────────────────────────────────────────────────────

export interface TransactionFilters {
  startDate?: string;
  endDate?: string;
  category?: string;
  type?: 'credit' | 'debit';
  limit?: number;
  offset?: number;
}

// ─── Service Methods ────────────────────────────────────────────────────────────

export async function getAllTransactions(userId: number, filters: TransactionFilters = {}) {
  const { startDate, endDate, category, type, limit = 50, offset = 0 } = filters;
  const conditions: string[] = ['user_id = $1'];
  const params: any[] = [userId];
  let idx = 2;

  if (startDate) { conditions.push(`date >= $${idx++}`); params.push(startDate); }
  if (endDate)   { conditions.push(`date <= $${idx++}`); params.push(endDate); }
  if (category)  { conditions.push(`category = $${idx++}`); params.push(category); }
  if (type)      { conditions.push(`type = $${idx++}`); params.push(type); }

  const where = conditions.join(' AND ');

  const [rowsResult, countResult] = await Promise.all([
    query(
      `SELECT * FROM transactions WHERE ${where} ORDER BY date DESC, created_at DESC LIMIT $${idx++} OFFSET $${idx++}`,
      [...params, limit, offset]
    ),
    query(`SELECT COUNT(*) FROM transactions WHERE ${where}`, params),
  ]);

  return {
    transactions: rowsResult.rows,
    total: parseInt(countResult.rows[0].count, 10),
    limit,
    offset,
  };
}

export async function getTransactionById(id: number, userId: number) {
  const result = await query('SELECT * FROM transactions WHERE id = $1 AND user_id = $2', [id, userId]);
  return result.rows[0] || null;
}

export interface TransactionInput {
  amount: number;
  type: 'credit' | 'debit';
  category?: string;
  description: string;
  date?: string;
  notes?: string;
}

export async function createTransaction(userId: number, data: TransactionInput) {
  const category = data.category || categorizeTransaction(data.description);
  const date = data.date || new Date().toISOString().split('T')[0];

  const result = await query(
    `INSERT INTO transactions (user_id, amount, type, category, description, date, notes)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [userId, data.amount, data.type, category, data.description, date, data.notes ?? null]
  );
  return result.rows[0];
}

export async function updateTransaction(id: number, userId: number, data: Partial<TransactionInput>) {
  // Fetch existing first to verify ownership
  const existing = await getTransactionById(id, userId);
  if (!existing) return null;

  const fields: string[] = [];
  const params: any[] = [];
  let idx = 1;

  if (data.amount    !== undefined) { fields.push(`amount = $${idx++}`);      params.push(data.amount); }
  if (data.type      !== undefined) { fields.push(`type = $${idx++}`);        params.push(data.type); }
  if (data.category  !== undefined) { fields.push(`category = $${idx++}`);    params.push(data.category); }
  if (data.description !== undefined) { fields.push(`description = $${idx++}`); params.push(data.description); }
  if (data.date      !== undefined) { fields.push(`date = $${idx++}`);        params.push(data.date); }
  if (data.notes     !== undefined) { fields.push(`notes = $${idx++}`);       params.push(data.notes); }

  if (fields.length === 0) return existing;

  fields.push(`updated_at = NOW()`);
  params.push(id, userId);

  const result = await query(
    `UPDATE transactions SET ${fields.join(', ')} WHERE id = $${idx++} AND user_id = $${idx++} RETURNING *`,
    params
  );
  return result.rows[0];
}

export async function deleteTransaction(id: number, userId: number) {
  const result = await query(
    'DELETE FROM transactions WHERE id = $1 AND user_id = $2 RETURNING id',
    [id, userId]
  );
  return result.rows.length > 0;
}

// ─── CSV Import ────────────────────────────────────────────────────────────────

export interface CSVRow {
  date?: string;
  description?: string;
  amount?: string;
  type?: string;
  category?: string;
  notes?: string;
}

export async function importCSV(userId: number, fileBuffer: Buffer): Promise<{ imported: number; errors: string[] }> {
  const rows: CSVRow[] = parse(fileBuffer, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  let imported = 0;
  const errors: string[] = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (!row) continue;
    try {
      const amount = parseFloat(row.amount ?? '');
      if (isNaN(amount) || amount <= 0) {
        errors.push(`Row ${i + 2}: Invalid amount "${row.amount ?? ''}"`);
        continue;
      }

      const type: 'credit' | 'debit' = (row.type?.toLowerCase() === 'credit') ? 'credit' : 'debit';
      const description = row.description?.trim();
      if (!description) {
        errors.push(`Row ${i + 2}: Missing description`);
        continue;
      }

      const date = row.date?.trim() || new Date().toISOString().split('T')[0];
      const category = row.category?.trim() || categorizeTransaction(description);

      await query(
        `INSERT INTO transactions (user_id, amount, type, category, description, date, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [userId, amount, type, category, description, date, row.notes ?? null]
      );
      imported++;
    } catch (err: unknown) {
      errors.push(`Row ${i + 2}: ${(err as Error).message}`);
    }
  }

  return { imported, errors };
}
