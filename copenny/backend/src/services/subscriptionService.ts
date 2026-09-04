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

// Detect subscriptions from transactions using a refined heuristic
export async function detectSubscriptions(userId: number) {
  // Look for transactions with the exact same description and amount that occur at least twice in the last 90 days.
  const result = await query(
    `SELECT description as name, amount, COUNT(*) as frequency, MAX(date) as last_date
     FROM transactions 
     WHERE user_id = $1 AND date >= NOW() - INTERVAL '90 days' AND type = 'debit'
     GROUP BY description, amount
     HAVING COUNT(*) >= 3
     ORDER BY frequency DESC`,
    [userId]
  );
  
  const detected = [];
  
  // Calculate a basic confidence score and auto-insert
  for (const row of result.rows) {
    const freq = parseInt(row.frequency, 10);
    const amount = parseFloat(row.amount);
    const name = row.name;
    const lastDate = new Date(row.last_date);
    
    // Check if this subscription already exists for this user
    const existing = await query(
      'SELECT id FROM subscriptions WHERE user_id = $1 AND name = $2',
      [userId, name]
    );
    
    if (existing.rows.length === 0) {
      // Calculate next billing date (approx 1 month from last date)
      const nextDate = new Date(lastDate);
      nextDate.setMonth(nextDate.getMonth() + 1);
      
      const sub = await createSubscription(userId, {
        name: name,
        amount: amount,
        billing_cycle: 'monthly',
        next_billing_date: nextDate.toISOString().split('T')[0] || '',
        category: 'Subscriptions',
        status: 'active'
      });
      detected.push(sub);
    }
  }
  
  return detected;
}

import * as featherlessService from './featherlessService';

export async function autoCategorizeSubscription(name: string, amount: number) {
  // Call our Featherless AI integration to guess the category for this recurring payment
  const category = await featherlessService.classifyTransaction(name, amount);
  return category;
}
