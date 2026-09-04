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
exports.deleteRule = exports.updateRule = exports.createRule = exports.getRules = void 0;
const ruleEngineService = __importStar(require("../services/ruleEngineService"));
const zod_1 = require("zod");
const ruleSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    condition: zod_1.z.any(),
    action: zod_1.z.any(),
    is_active: zod_1.z.boolean().optional()
});
const getRules = async (req, res) => {
    try {
        const userId = req.user.userId;
        const rules = await ruleEngineService.getRules(userId);
        res.json(rules);
    }
    catch (error) {
        console.error('Error fetching rules:', error);
        res.status(500).json({ error: 'Failed to fetch rules' });
    }
};
exports.getRules = getRules;
const createRule = async (req, res) => {
    try {
        const userId = req.user.userId;
        const data = ruleSchema.parse(req.body);
        const rule = await ruleEngineService.createRule(userId, {
            name: data.name,
            condition: data.condition,
            action: data.action,
            is_active: data.is_active ?? true
        });
        res.status(201).json(rule);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ error: error.issues });
        }
        else {
            console.error('Error creating rule:', error);
            res.status(500).json({ error: 'Failed to create rule' });
        }
    }
};
exports.createRule = createRule;
const updateRule = async (req, res) => {
    try {
        const userId = req.user.userId;
        const ruleId = parseInt(req.params.id, 10);
        const data = ruleSchema.partial().parse(req.body);
        const updateData = {};
        if (data.name !== undefined)
            updateData.name = data.name;
        if (data.condition !== undefined)
            updateData.condition = data.condition;
        if (data.action !== undefined)
            updateData.action = data.action;
        if (data.is_active !== undefined)
            updateData.is_active = data.is_active;
        const rule = await ruleEngineService.updateRule(ruleId, userId, updateData);
        if (!rule) {
            res.status(404).json({ error: 'Rule not found' });
            return;
        }
        res.json(rule);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ error: error.issues });
        }
        else {
            console.error('Error updating rule:', error);
            res.status(500).json({ error: 'Failed to update rule' });
        }
    }
};
exports.updateRule = updateRule;
const deleteRule = async (req, res) => {
    try {
        const userId = req.user.userId;
        const ruleId = parseInt(req.params.id, 10);
        const success = await ruleEngineService.deleteRule(ruleId, userId);
        if (!success) {
            res.status(404).json({ error: 'Rule not found' });
            return;
        }
        res.status(204).send();
    }
    catch (error) {
        console.error('Error deleting rule:', error);
        res.status(500).json({ error: 'Failed to delete rule' });
    }
};
exports.deleteRule = deleteRule;
//# sourceMappingURL=ruleController.js.map