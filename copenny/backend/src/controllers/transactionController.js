"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategories = exports.importCSVHandler = exports.deleteTransactionHandler = exports.updateTransactionHandler = exports.createTransactionHandler = exports.getTransactions = exports.upload = void 0;
const zod_1 = require("zod");
const multer_1 = __importDefault(require("multer"));
const transactionService_1 = require("../services/transactionService");
// Run once at startup to ensure table exists
(0, transactionService_1.ensureTransactionsTable)().catch(console.error);
// ─── Multer ────────────────────────────────────────────────────────────────────
exports.upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
            cb(null, true);
        }
        else {
            cb(new Error('Only CSV files are allowed'));
        }
    },
});
// ─── Zod Schemas ───────────────────────────────────────────────────────────────
const createSchema = zod_1.z.object({
    amount: zod_1.z.coerce.number().positive('Amount must be positive'),
    type: zod_1.z.enum(['credit', 'debit']),
    category: zod_1.z.enum(transactionService_1.CATEGORIES).optional(),
    description: zod_1.z.string().min(1, 'Description is required').max(500),
    date: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD').optional(),
    notes: zod_1.z.string().max(1000).optional(),
});
const updateSchema = createSchema.partial();
const filtersSchema = zod_1.z.object({
    startDate: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    endDate: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    category: zod_1.z.enum(transactionService_1.CATEGORIES).optional(),
    type: zod_1.z.enum(['credit', 'debit']).optional(),
    limit: zod_1.z.coerce.number().int().min(1).max(200).optional(),
    offset: zod_1.z.coerce.number().int().min(0).optional(),
});
// ─── Helpers ───────────────────────────────────────────────────────────────────
function getParam(req, key) {
    const val = req.params[key];
    if (Array.isArray(val))
        return val[0] ?? '';
    return val ?? '';
}
// ─── Controller Methods ────────────────────────────────────────────────────────
const getTransactions = async (req, res, next) => {
    try {
        const parsed = filtersSchema.safeParse(req.query);
        if (!parsed.success) {
            return res.status(400).json({ success: false, errors: parsed.error.flatten().fieldErrors });
        }
        // Build filters — only include keys that are defined
        const filters = {};
        const d = parsed.data;
        if (d.startDate !== undefined)
            filters.startDate = d.startDate;
        if (d.endDate !== undefined)
            filters.endDate = d.endDate;
        if (d.category !== undefined)
            filters.category = d.category;
        if (d.type !== undefined)
            filters.type = d.type;
        if (d.limit !== undefined)
            filters.limit = d.limit;
        if (d.offset !== undefined)
            filters.offset = d.offset;
        const data = await (0, transactionService_1.getAllTransactions)(req.user.id, filters);
        return res.json({ success: true, ...data });
    }
    catch (err) {
        next(err);
    }
};
exports.getTransactions = getTransactions;
const createTransactionHandler = async (req, res, next) => {
    try {
        const parsed = createSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ success: false, errors: parsed.error.flatten().fieldErrors });
        }
        const input = {
            amount: parsed.data.amount,
            type: parsed.data.type,
            description: parsed.data.description,
        };
        if (parsed.data.category !== undefined)
            input.category = parsed.data.category;
        if (parsed.data.date !== undefined)
            input.date = parsed.data.date;
        if (parsed.data.notes !== undefined)
            input.notes = parsed.data.notes;
        const transaction = await (0, transactionService_1.createTransaction)(req.user.id, input);
        return res.status(201).json({ success: true, transaction });
    }
    catch (err) {
        next(err);
    }
};
exports.createTransactionHandler = createTransactionHandler;
const updateTransactionHandler = async (req, res, next) => {
    try {
        const id = parseInt(getParam(req, 'id'), 10);
        if (isNaN(id))
            return res.status(400).json({ success: false, error: 'Invalid transaction ID' });
        const parsed = updateSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ success: false, errors: parsed.error.flatten().fieldErrors });
        }
        const input = {};
        const d = parsed.data;
        if (d.amount !== undefined)
            input.amount = d.amount;
        if (d.type !== undefined)
            input.type = d.type;
        if (d.category !== undefined)
            input.category = d.category;
        if (d.description !== undefined)
            input.description = d.description;
        if (d.date !== undefined)
            input.date = d.date;
        if (d.notes !== undefined)
            input.notes = d.notes;
        const transaction = await (0, transactionService_1.updateTransaction)(id, req.user.id, input);
        if (!transaction) {
            return res.status(404).json({ success: false, error: 'Transaction not found or access denied' });
        }
        return res.json({ success: true, transaction });
    }
    catch (err) {
        next(err);
    }
};
exports.updateTransactionHandler = updateTransactionHandler;
const deleteTransactionHandler = async (req, res, next) => {
    try {
        const id = parseInt(getParam(req, 'id'), 10);
        if (isNaN(id))
            return res.status(400).json({ success: false, error: 'Invalid transaction ID' });
        const deleted = await (0, transactionService_1.deleteTransaction)(id, req.user.id);
        if (!deleted) {
            return res.status(404).json({ success: false, error: 'Transaction not found or access denied' });
        }
        return res.json({ success: true, message: 'Transaction deleted' });
    }
    catch (err) {
        next(err);
    }
};
exports.deleteTransactionHandler = deleteTransactionHandler;
const importCSVHandler = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, error: 'No CSV file uploaded. Use field name "file".' });
        }
        const result = await (0, transactionService_1.importCSV)(req.user.id, req.file.buffer);
        return res.status(201).json({ success: true, ...result });
    }
    catch (err) {
        next(err);
    }
};
exports.importCSVHandler = importCSVHandler;
const getCategories = (_req, res) => {
    return res.json({ success: true, categories: transactionService_1.CATEGORIES });
};
exports.getCategories = getCategories;
//# sourceMappingURL=transactionController.js.map