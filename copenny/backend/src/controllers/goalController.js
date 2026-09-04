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
exports.getGoals = getGoals;
exports.createGoal = createGoal;
exports.updateGoalProgress = updateGoalProgress;
exports.deleteGoal = deleteGoal;
const zod_1 = require("zod");
const goalService = __importStar(require("../services/goalService"));
const goalSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    target_amount: zod_1.z.number().positive(),
    current_amount: zod_1.z.number().min(0).optional(),
    deadline: zod_1.z.string().optional(),
    color: zod_1.z.string().optional(),
});
const progressSchema = zod_1.z.object({
    current_amount: zod_1.z.number().min(0)
});
async function getGoals(req, res) {
    try {
        const userId = req.user.userId;
        const goals = await goalService.getAllGoals(userId);
        // Add progress percentage to each goal
        const withProgress = goals.map(g => ({
            ...g,
            progress_percentage: goalService.calculateGoalProgress(g)
        }));
        res.json(withProgress);
    }
    catch (error) {
        console.error('Error fetching goals:', error);
        res.status(500).json({ error: 'Failed to fetch goals' });
    }
}
async function createGoal(req, res) {
    try {
        const userId = req.user.userId;
        const data = goalSchema.parse(req.body);
        const newGoal = await goalService.createGoal(userId, data);
        res.status(201).json(newGoal);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ error: 'Validation failed', details: error.errors });
        }
        else {
            console.error('Error creating goal:', error);
            res.status(500).json({ error: 'Failed to create goal' });
        }
    }
}
async function updateGoalProgress(req, res) {
    try {
        const userId = req.user.userId;
        const id = parseInt(req.params.id, 10);
        const data = progressSchema.parse(req.body);
        const updated = await goalService.updateGoalProgress(id, userId, data.current_amount);
        if (!updated) {
            res.status(404).json({ error: 'Goal not found' });
            return;
        }
        res.json(updated);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ error: 'Validation failed', details: error.errors });
        }
        else {
            console.error('Error updating goal:', error);
            res.status(500).json({ error: 'Failed to update goal' });
        }
    }
}
async function deleteGoal(req, res) {
    try {
        const userId = req.user.userId;
        const id = parseInt(req.params.id, 10);
        const success = await goalService.deleteGoal(id, userId);
        if (!success) {
            res.status(404).json({ error: 'Goal not found' });
            return;
        }
        res.json({ message: 'Goal deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting goal:', error);
        res.status(500).json({ error: 'Failed to delete goal' });
    }
}
//# sourceMappingURL=goalController.js.map