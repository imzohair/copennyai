import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import multer from 'multer';
import {
  getAllTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  importCSV,
  CATEGORIES,
  ensureTransactionsTable,
  type TransactionFilters,
  type TransactionInput,
} from '../services/transactionService';
import { emitToUser } from '../services/websocketService';
import { detectSubscriptions } from '../services/subscriptionService';
import { evaluateRules } from '../services/ruleEngineService';

// Run once at startup to ensure table exists
ensureTransactionsTable().catch(console.error);

// ─── Multer ────────────────────────────────────────────────────────────────────

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'));
    }
  },
});

// ─── Zod Schemas ───────────────────────────────────────────────────────────────

const createSchema = z.object({
  amount: z.coerce.number().positive('Amount must be positive'),
  type: z.enum(['credit', 'debit']),
  category: z.enum(CATEGORIES).optional(),
  description: z.string().min(1, 'Description is required').max(500),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD').optional(),
  notes: z.string().max(1000).optional(),
});

const updateSchema = createSchema.partial();

const filtersSchema = z.object({
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  endDate:   z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  category:  z.enum(CATEGORIES).optional(),
  type:      z.enum(['credit', 'debit']).optional(),
  limit:     z.coerce.number().int().min(1).max(5000).optional(),
  offset:    z.coerce.number().int().min(0).optional(),
});

// ─── Helpers ───────────────────────────────────────────────────────────────────

function getParam(req: Request, key: string): string {
  const val = req.params[key];
  if (Array.isArray(val)) return val[0] ?? '';
  return val ?? '';
}

// ─── Controller Methods ────────────────────────────────────────────────────────

export const getTransactions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = filtersSchema.safeParse(req.query);
    if (!parsed.success) {
      return res.status(400).json({ success: false, errors: parsed.error.flatten().fieldErrors });
    }
    // Build filters — only include keys that are defined
    const filters: TransactionFilters = {};
    const d = parsed.data;
    if (d.startDate !== undefined) filters.startDate = d.startDate;
    if (d.endDate   !== undefined) filters.endDate   = d.endDate;
    if (d.category  !== undefined) filters.category  = d.category;
    if (d.type      !== undefined) filters.type      = d.type;
    if (d.limit     !== undefined) filters.limit     = d.limit;
    if (d.offset    !== undefined) filters.offset    = d.offset;

    const data = await getAllTransactions(req.user.id as number, filters);
    return res.json({ success: true, ...data });
  } catch (err) {
    next(err);
  }
};

export const createTransactionHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, errors: parsed.error.flatten().fieldErrors });
    }
    const input: TransactionInput = {
      amount: parsed.data.amount,
      type: parsed.data.type,
      description: parsed.data.description,
    };
    if (parsed.data.category  !== undefined) input.category = parsed.data.category;
    if (parsed.data.date      !== undefined) input.date     = parsed.data.date;
    if (parsed.data.notes     !== undefined) input.notes    = parsed.data.notes;

    const userId = req.user.id as number;
    const transaction = await createTransaction(userId, input);

    // Notify frontend
    emitToUser(userId, 'new-transaction', transaction);

    return res.status(201).json({ success: true, transaction });
  } catch (err) {
    next(err);
  }
};

export const updateTransactionHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(getParam(req, 'id'), 10);
    if (isNaN(id)) return res.status(400).json({ success: false, error: 'Invalid transaction ID' });

    const parsed = updateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, errors: parsed.error.flatten().fieldErrors });
    }
    const input: Partial<TransactionInput> = {};
    const d = parsed.data;
    if (d.amount      !== undefined) input.amount      = d.amount;
    if (d.type        !== undefined) input.type        = d.type;
    if (d.category    !== undefined) input.category    = d.category;
    if (d.description !== undefined) input.description = d.description;
    if (d.date        !== undefined) input.date        = d.date;
    if (d.notes       !== undefined) input.notes       = d.notes;

    const transaction = await updateTransaction(id, req.user.id as number, input);
    if (!transaction) {
      return res.status(404).json({ success: false, error: 'Transaction not found or access denied' });
    }
    return res.json({ success: true, transaction });
  } catch (err) {
    next(err);
  }
};

export const deleteTransactionHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(getParam(req, 'id'), 10);
    if (isNaN(id)) return res.status(400).json({ success: false, error: 'Invalid transaction ID' });

    const deleted = await deleteTransaction(id, req.user.id as number);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Transaction not found or access denied' });
    }
    return res.json({ success: true, message: 'Transaction deleted' });
  } catch (err) {
    next(err);
  }
};

export const importCSVHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No CSV file uploaded. Use field name "file".' });
    }
    const result = await importCSV(req.user.id as number, req.file.buffer);

    // Automatically trigger analysis on new data so it's instantly visible on the frontend
    try {
      await detectSubscriptions(req.user.id as number);
      await evaluateRules(req.user.id as number);
    } catch (analysisErr) {
      console.error('Error running post-import analysis:', analysisErr);
    }

    return res.status(201).json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};

export const getCategories = (_req: Request, res: Response) => {
  return res.json({ success: true, categories: CATEGORIES });
};
