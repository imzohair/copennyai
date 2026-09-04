"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluateRules = evaluateRules;
exports.executeAction = executeAction;
exports.getRules = getRules;
exports.createRule = createRule;
exports.updateRule = updateRule;
exports.deleteRule = deleteRule;
const db_1 = require("../config/db");
async function evaluateRules(userId) {
    // 1. Fetch active rules for user
    const rulesRes = await (0, db_1.query)('SELECT * FROM rules WHERE user_id = $1 AND is_active = true', [userId]);
    const rules = rulesRes.rows;
    if (rules.length === 0)
        return;
    // 2. Fetch user context (balance, spending)
    const balanceRes = await (0, db_1.query)(`
    SELECT 
      SUM(CASE WHEN type = 'credit' THEN amount ELSE 0 END) - 
      SUM(CASE WHEN type = 'debit' THEN amount ELSE 0 END) as balance
    FROM transactions
    WHERE user_id = $1
  `, [userId]);
    const balance = parseFloat(balanceRes.rows[0].balance) || 0;
    const context = { balance };
    // 3. Evaluate each rule
    for (const rule of rules) {
        try {
            const isTriggered = evaluateCondition(rule.condition, context);
            if (isTriggered) {
                await executeAction(rule, context);
            }
        }
        catch (err) {
            console.error(`Failed to evaluate rule ${rule.id}`, err);
        }
    }
}
function evaluateCondition(condition, context) {
    if (!condition || !condition.metric || !condition.operator)
        return false;
    const ctxValue = context[condition.metric];
    if (ctxValue === undefined)
        return false;
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
async function executeAction(rule, context) {
    console.log(`Executing rule action for user ${rule.user_id}: [${rule.name}]`);
    const action = rule.action;
    if (!action)
        return;
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
async function getRules(userId) {
    const result = await (0, db_1.query)('SELECT * FROM rules WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    return result.rows;
}
async function createRule(userId, data) {
    const result = await (0, db_1.query)(`INSERT INTO rules (user_id, name, condition, action, is_active)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`, [userId, data.name, data.condition, data.action, data.is_active ?? true]);
    return result.rows[0];
}
async function updateRule(id, userId, data) {
    const fields = [];
    const params = [];
    let idx = 1;
    if (data.name !== undefined) {
        fields.push(`name = $${idx++}`);
        params.push(data.name);
    }
    if (data.condition !== undefined) {
        fields.push(`condition = $${idx++}`);
        params.push(data.condition);
    }
    if (data.action !== undefined) {
        fields.push(`action = $${idx++}`);
        params.push(data.action);
    }
    if (data.is_active !== undefined) {
        fields.push(`is_active = $${idx++}`);
        params.push(data.is_active);
    }
    if (fields.length === 0)
        return null;
    fields.push(`updated_at = NOW()`);
    params.push(id, userId);
    const result = await (0, db_1.query)(`UPDATE rules SET ${fields.join(', ')} WHERE id = $${idx++} AND user_id = $${idx++} RETURNING *`, params);
    return result.rows[0] || null;
}
async function deleteRule(id, userId) {
    const result = await (0, db_1.query)('DELETE FROM rules WHERE id = $1 AND user_id = $2 RETURNING id', [id, userId]);
    return result.rows.length > 0;
}
//# sourceMappingURL=ruleEngineService.js.map