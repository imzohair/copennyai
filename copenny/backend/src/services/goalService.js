"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllGoals = getAllGoals;
exports.getGoalById = getGoalById;
exports.createGoal = createGoal;
exports.updateGoalProgress = updateGoalProgress;
exports.deleteGoal = deleteGoal;
exports.calculateGoalProgress = calculateGoalProgress;
const db_1 = require("../config/db");
async function getAllGoals(userId) {
    const result = await (0, db_1.query)('SELECT * FROM goals WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    return result.rows;
}
async function getGoalById(id, userId) {
    const result = await (0, db_1.query)('SELECT * FROM goals WHERE id = $1 AND user_id = $2', [id, userId]);
    return result.rows[0] || null;
}
async function createGoal(userId, data) {
    const current = data.current_amount || 0;
    const result = await (0, db_1.query)(`INSERT INTO goals (user_id, name, target_amount, current_amount, deadline, color)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`, [userId, data.name, data.target_amount, current, data.deadline || null, data.color || null]);
    return result.rows[0];
}
async function updateGoalProgress(id, userId, currentAmount) {
    const existing = await getGoalById(id, userId);
    if (!existing)
        return null;
    const result = await (0, db_1.query)(`UPDATE goals 
     SET current_amount = $1, updated_at = NOW() 
     WHERE id = $2 AND user_id = $3 
     RETURNING *`, [currentAmount, id, userId]);
    return result.rows[0];
}
async function deleteGoal(id, userId) {
    const result = await (0, db_1.query)('DELETE FROM goals WHERE id = $1 AND user_id = $2 RETURNING id', [id, userId]);
    return result.rows.length > 0;
}
function calculateGoalProgress(goal) {
    const target = Number(goal.target_amount);
    const current = Number(goal.current_amount);
    if (target <= 0)
        return 100;
    const pct = (current / target) * 100;
    return Math.min(Math.max(pct, 0), 100);
}
//# sourceMappingURL=goalService.js.map