import { query } from '../config/db';

export interface GoalInput {
  name: string;
  target_amount: number;
  current_amount?: number;
  deadline?: string;
  color?: string;
}

export async function getAllGoals(userId: number) {
  const result = await query('SELECT * FROM goals WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
  return result.rows;
}

export async function getGoalById(id: number, userId: number) {
  const result = await query('SELECT * FROM goals WHERE id = $1 AND user_id = $2', [id, userId]);
  return result.rows[0] || null;
}

export async function createGoal(userId: number, data: GoalInput) {
  const current = data.current_amount || 0;
  
  const result = await query(
    `INSERT INTO goals (user_id, name, target_amount, current_amount, deadline, color)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [userId, data.name, data.target_amount, current, data.deadline || null, data.color || null]
  );
  return result.rows[0];
}

export async function updateGoalProgress(id: number, userId: number, currentAmount: number) {
  const existing = await getGoalById(id, userId);
  if (!existing) return null;

  const result = await query(
    `UPDATE goals 
     SET current_amount = $1, updated_at = NOW() 
     WHERE id = $2 AND user_id = $3 
     RETURNING *`,
    [currentAmount, id, userId]
  );
  return result.rows[0];
}

export async function deleteGoal(id: number, userId: number) {
  const result = await query(
    'DELETE FROM goals WHERE id = $1 AND user_id = $2 RETURNING id',
    [id, userId]
  );
  return result.rows.length > 0;
}

export function calculateGoalProgress(goal: { target_amount: string | number, current_amount: string | number }): number {
  const target = Number(goal.target_amount);
  const current = Number(goal.current_amount);
  if (target <= 0) return 100;
  const pct = (current / target) * 100;
  return Math.min(Math.max(pct, 0), 100);
}
