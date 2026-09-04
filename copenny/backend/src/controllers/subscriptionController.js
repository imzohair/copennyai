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
exports.getSubscriptions = getSubscriptions;
exports.createSubscription = createSubscription;
exports.updateSubscription = updateSubscription;
exports.deleteSubscription = deleteSubscription;
exports.detectSubscriptions = detectSubscriptions;
const zod_1 = require("zod");
const subscriptionService = __importStar(require("../services/subscriptionService"));
const subscriptionSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    amount: zod_1.z.number().positive(),
    billing_cycle: zod_1.z.enum(['monthly', 'yearly', 'weekly']),
    next_billing_date: zod_1.z.string(),
    category: zod_1.z.string().optional(),
    status: zod_1.z.enum(['active', 'inactive', 'cancelled']).optional(),
});
const updateSubscriptionSchema = subscriptionSchema.partial();
async function getSubscriptions(req, res) {
    try {
        const userId = req.user.userId;
        const subscriptions = await subscriptionService.getAllSubscriptions(userId);
        res.json(subscriptions);
    }
    catch (error) {
        console.error('Error fetching subscriptions:', error);
        res.status(500).json({ error: 'Failed to fetch subscriptions' });
    }
}
async function createSubscription(req, res) {
    try {
        const userId = req.user.userId;
        const data = subscriptionSchema.parse(req.body);
        const newSub = await subscriptionService.createSubscription(userId, data);
        res.status(201).json(newSub);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ error: 'Validation failed', details: error.errors });
        }
        else {
            console.error('Error creating subscription:', error);
            res.status(500).json({ error: 'Failed to create subscription' });
        }
    }
}
async function updateSubscription(req, res) {
    try {
        const userId = req.user.userId;
        const id = parseInt(req.params.id, 10);
        const data = updateSubscriptionSchema.parse(req.body);
        const updated = await subscriptionService.updateSubscription(id, userId, data);
        if (!updated) {
            res.status(404).json({ error: 'Subscription not found' });
            return;
        }
        res.json(updated);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ error: 'Validation failed', details: error.errors });
        }
        else {
            console.error('Error updating subscription:', error);
            res.status(500).json({ error: 'Failed to update subscription' });
        }
    }
}
async function deleteSubscription(req, res) {
    try {
        const userId = req.user.userId;
        const id = parseInt(req.params.id, 10);
        const success = await subscriptionService.deleteSubscription(id, userId);
        if (!success) {
            res.status(404).json({ error: 'Subscription not found' });
            return;
        }
        res.json({ message: 'Subscription deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting subscription:', error);
        res.status(500).json({ error: 'Failed to delete subscription' });
    }
}
async function detectSubscriptions(req, res) {
    try {
        const userId = req.user.userId;
        const potentials = await subscriptionService.detectSubscriptions(userId);
        res.json(potentials);
    }
    catch (error) {
        console.error('Error detecting subscriptions:', error);
        res.status(500).json({ error: 'Failed to detect subscriptions' });
    }
}
//# sourceMappingURL=subscriptionController.js.map