import { query } from '../config/db';

export interface BudgetInput {
  category: string;
  limit_amount: number;
  spent_amount?: number;
  month: string;
}

export async function getAllBudgets(userId: number, month?: string) {
  let q = 'SELECT * FROM budgets WHERE user_id = $1';
  const params: any[] = [userId];
  
  if (month) {
    q += ' AND month = $2';
    params.push(month);
  }
  
  q += ' ORDER BY created_at DESC';
  const result = await query(q, params);
  return result.rows;
}

export async function getBudgetById(id: number, userId: number) {
  const result = await query('SELECT * FROM budgets WHERE id = $1 AND user_id = $2', [id, userId]);
  return result.rows[0] || null;
}

export async function createBudget(userId: number, data: BudgetInput) {
  // Prevent duplicate budgets for the same category in the same month
  const check = await query('SELECT id FROM budgets WHERE user_id = $1 AND category = $2 AND month = $3', [userId, data.category, data.month]);
  if (check.rows.length > 0) {
    throw new Error('Budget already exists for this category in the specified month.');
  }

  const result = await query(
    `INSERT INTO budgets (user_id, category, limit_amount, spent_amount, month)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [userId, data.category, data.limit_amount, data.spent_amount || 0, data.month]
  );
  return result.rows[0];
}

export async function updateBudget(id: number, userId: number, data: Partial<BudgetInput>) {
  const existing = await getBudgetById(id, userId);
  if (!existing) return null;

  const fields: string[] = [];
  const params: any[] = [];
  let idx = 1;

  if (data.category !== undefined) { fields.push(`category = $${idx++}`); params.push(data.category); }
  if (data.limit_amount !== undefined) { fields.push(`limit_amount = $${idx++}`); params.push(data.limit_amount); }
  if (data.spent_amount !== undefined) { fields.push(`spent_amount = $${idx++}`); params.push(data.spent_amount); }
  if (data.month !== undefined) { fields.push(`month = $${idx++}`); params.push(data.month); }

  if (fields.length === 0) return existing;

  fields.push(`updated_at = NOW()`);
  params.push(id, userId);

  const result = await query(
    `UPDATE budgets SET ${fields.join(', ')} WHERE id = $${idx++} AND user_id = $${idx++} RETURNING *`,
    params
  );
  return result.rows[0];
}

export async function deleteBudget(id: number, userId: number) {
  const result = await query(
    'DELETE FROM budgets WHERE id = $1 AND user_id = $2 RETURNING id',
    [id, userId]
  );
  return result.rows.length > 0;
}
