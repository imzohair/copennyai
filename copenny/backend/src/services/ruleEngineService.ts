import { query } from '../config/db';

export interface Rule {
  id?: number;
  user_id: number;
  name: string;
  condition: any; // e.g., { metric: 'balance', operator: '<', value: 5000 }
  action: any;    // e.g., { type: 'alert', message: 'Balance low!' }
  is_active: boolean;
}

export async function evaluateRules(userId: number) {
  // 1. Fetch active rules for user
  const rulesRes = await query('SELECT * FROM rules WHERE user_id = $1 AND is_active = true', [userId]);
  const rules = rulesRes.rows as Rule[];

  if (rules.length === 0) return;

  // 2. Fetch user context (balance, spending)
  const balanceRes = await query(`
    SELECT 
      SUM(CASE WHEN type = 'credit' THEN amount ELSE 0 END) - 
      SUM(CASE WHEN type = 'debit' THEN amount ELSE 0 END) as balance
    FROM transactions
    WHERE user_id = $1
  `, [userId]);
  const balance = parseFloat(balanceRes.rows[0].balance) || 0;

  const context: any = { balance };

  // 3. Evaluate each rule
  for (const rule of rules) {
    try {
      const isTriggered = evaluateCondition(rule.condition, context);
      if (isTriggered) {
        await executeAction(rule, context);
      }
    } catch (err) {
      console.error(`Failed to evaluate rule ${rule.id}`, err);
    }
  }
}

function evaluateCondition(condition: any, context: any): boolean {
  if (!condition || !condition.metric || !condition.operator) return false;
  
  const ctxValue = context[condition.metric];
  if (ctxValue === undefined) return false;

  const targetValue = condition.value;

  switch (condition.operator) {
    case '<': return ctxValue < targetValue;
    case '>': return ctxValue > targetValue;
    case '<=': return ctxValue <= targetValue;
    case '>=': return ctxValue >= targetValue;
    case '==': return ctxValue == targetValue;
    case '!=': return ctxValue != targetValue;
    default: return false;
  }
}

export async function executeAction(rule: Rule, context: any) {
  console.log(`Executing rule action for user ${rule.user_id}: [${rule.name}]`);
  
  const action = rule.action;
  if (!action) return;

  switch (action.type) {
    case 'alert':
      // In a real app, send an email, push notification, or save to notifications table
      console.log(`[ALERT] User ${rule.user_id}: ${action.message}`);
      break;
    case 'adjust_budget':
      console.log(`[BUDGET ADJUSTED] User ${rule.user_id}: Category ${action.category} adjusted by ${action.amount}`);
      break;
    default:
      console.log(`[UNKNOWN ACTION] ${action.type}`);
  }
}

// CRUD Operations
export async function getRules(userId: number) {
  const result = await query('SELECT * FROM rules WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
  return result.rows;
}

export async function createRule(userId: number, data: Omit<Rule, 'id' | 'user_id'>) {
  const result = await query(
    `INSERT INTO rules (user_id, name, condition, action, is_active)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [userId, data.name, data.condition, data.action, data.is_active ?? true]
  );
  return result.rows[0];
}

export async function updateRule(id: number, userId: number, data: Partial<Rule>) {
  const fields: string[] = [];
  const params: any[] = [];
  let idx = 1;

  if (data.name !== undefined) { fields.push(`name = $${idx++}`); params.push(data.name); }
  if (data.condition !== undefined) { fields.push(`condition = $${idx++}`); params.push(data.condition); }
  if (data.action !== undefined) { fields.push(`action = $${idx++}`); params.push(data.action); }
  if (data.is_active !== undefined) { fields.push(`is_active = $${idx++}`); params.push(data.is_active); }

  if (fields.length === 0) return null;

  fields.push(`updated_at = NOW()`);
  params.push(id, userId);

  const result = await query(
    `UPDATE rules SET ${fields.join(', ')} WHERE id = $${idx++} AND user_id = $${idx++} RETURNING *`,
    params
  );
  return result.rows[0] || null;
}

export async function deleteRule(id: number, userId: number) {
  const result = await query(
    'DELETE FROM rules WHERE id = $1 AND user_id = $2 RETURNING id',
    [id, userId]
  );
  return result.rows.length > 0;
}
