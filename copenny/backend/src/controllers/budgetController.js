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
exports.getBudgets = getBudgets;
exports.createBudget = createBudget;
exports.updateBudget = updateBudget;
exports.deleteBudget = deleteBudget;
const zod_1 = require("zod");
const budgetService = __importStar(require("../services/budgetService"));
const budgetSchema = zod_1.z.object({
    category: zod_1.z.string().min(1),
    limit_amount: zod_1.z.number().positive(),
    spent_amount: zod_1.z.number().min(0).optional(),
    month: zod_1.z.string().regex(/^\d{4}-\d{2}$/, "Must be YYYY-MM format"),
});
const updateBudgetSchema = budgetSchema.partial();
async function getBudgets(req, res) {
    try {
        const userId = req.user.userId;
        const month = req.query.month;
        const budgets = await budgetService.getAllBudgets(userId, month);
        res.json(budgets);
    }
    catch (error) {
        console.error('Error fetching budgets:', error);
        res.status(500).json({ error: 'Failed to fetch budgets' });
    }
}
async function createBudget(req, res) {
    try {
        const userId = req.user.userId;
        const data = budgetSchema.parse(req.body);
        const newBudget = await budgetService.createBudget(userId, data);
        res.status(201).json(newBudget);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ error: 'Validation failed', details: error.errors });
        }
        else if (error instanceof Error && error.message.includes('already exists')) {
            res.status(409).json({ error: error.message });
        }
        else {
            console.error('Error creating budget:', error);
            res.status(500).json({ error: 'Failed to create budget' });
        }
    }
}
async function updateBudget(req, res) {
    try {
        const userId = req.user.userId;
        const id = parseInt(req.params.id, 10);
        const data = updateBudgetSchema.parse(req.body);
        const updated = await budgetService.updateBudget(id, userId, data);
        if (!updated) {
            res.status(404).json({ error: 'Budget not found' });
            return;
        }
        res.json(updated);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ error: 'Validation failed', details: error.errors });
        }
        else {
            console.error('Error updating budget:', error);
            res.status(500).json({ error: 'Failed to update budget' });
        }
    }
}
async function deleteBudget(req, res) {
    try {
        const userId = req.user.userId;
        const id = parseInt(req.params.id, 10);
        const success = await budgetService.deleteBudget(id, userId);
        if (!success) {
            res.status(404).json({ error: 'Budget not found' });
            return;
        }
        res.json({ message: 'Budget deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting budget:', error);
        res.status(500).json({ error: 'Failed to delete budget' });
    }
}
//# sourceMappingURL=budgetController.js.map