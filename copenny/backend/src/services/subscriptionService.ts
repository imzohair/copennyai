import { query } from '../config/db';

export interface SubscriptionInput {
  name: string;
  amount: number;
  billing_cycle: 'monthly' | 'yearly' | 'weekly';
  next_billing_date: string;
  category?: string;
  status?: 'active' | 'inactive' | 'cancelled';
}

export async function getAllSubscriptions(userId: number) {
  const result = await query('SELECT * FROM subscriptions WHERE user_id = $1 ORDER BY next_billing_date ASC', [userId]);
  return result.rows;
}

export async function getSubscriptionById(id: number, userId: number) {
  const result = await query('SELECT * FROM subscriptions WHERE id = $1 AND user_id = $2', [id, userId]);
  return result.rows[0] || null;
}

export async function createSubscription(userId: number, data: SubscriptionInput) {
  const status = data.status || 'active';
  const category = data.category || 'Subscriptions';

  const result = await query(
    `INSERT INTO subscriptions (user_id, name, amount, billing_cycle, next_billing_date, category, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [userId, data.name, data.amount, data.billing_cycle, data.next_billing_date, category, status]
  );
  return result.rows[0];
}

export async function updateSubscription(id: number, userId: number, data: Partial<SubscriptionInput>) {
  const existing = await getSubscriptionById(id, userId);
  if (!existing) return null;

  const fields: string[] = [];
  const params: any[] = [];
  let idx = 1;

  if (data.name !== undefined) { fields.push(`name = $${idx++}`); params.push(data.name); }
  if (data.amount !== undefined) { fields.push(`amount = $${idx++}`); params.push(data.amount); }
  if (data.billing_cycle !== undefined) { fields.push(`billing_cycle = $${idx++}`); params.push(data.billing_cycle); }
  if (data.next_billing_date !== undefined) { fields.push(`next_billing_date = $${idx++}`); params.push(data.next_billing_date); }
  if (data.category !== undefined) { fields.push(`category = $${idx++}`); params.push(data.category); }
  if (data.status !== undefined) { fields.push(`status = $${idx++}`); params.push(data.status); }

  if (fields.length === 0) return existing;

  fields.push(`updated_at = NOW()`);
  params.push(id, userId);

  const result = await query(
    `UPDATE subscriptions SET ${fields.join(', ')} WHERE id = $${idx++} AND user_id = $${idx++} RETURNING *`,
    params
  );
  return result.rows[0];
}

export async function deleteSubscription(id: number, userId: number) {
  const result = await query(
    'DELETE FROM subscriptions WHERE id = $1 AND user_id = $2 RETURNING id',
    [id, userId]
  );
  return result.rows.length > 0;
}

// Detect subscriptions from transactions
export async function detectSubscriptions(userId: number) {
  // Simple heuristic: Same amount, same description, at least 2 occurrences in the last 90 days.
  const result = await query(
    `SELECT description as name, amount, COUNT(*) as frequency
     FROM transactions 
     WHERE user_id = $1 AND date >= NOW() - INTERVAL '90 days' AND type = 'debit'
     GROUP BY description, amount
     HAVING COUNT(*) >= 2
     ORDER BY frequency DESC`,
    [userId]
  );
  
  // We don't automatically insert them, we just return potentials so the frontend can suggest them
  return result.rows.map(row => ({
    name: row.name,
    amount: parseFloat(row.amount),
    frequency: parseInt(row.frequency, 10),
    suggested_cycle: 'monthly'
  }));
}
