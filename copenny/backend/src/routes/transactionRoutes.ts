import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  getTransactions,
  createTransactionHandler,
  updateTransactionHandler,
  deleteTransactionHandler,
  importCSVHandler,
  getCategories,
  upload,
} from '../controllers/transactionController';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// GET /api/transactions?startDate=&endDate=&category=&type=&limit=&offset=
router.get('/', getTransactions);

// GET /api/transactions/categories
router.get('/categories', getCategories);

// POST /api/transactions
router.post('/', createTransactionHandler);

// PUT /api/transactions/:id
router.put('/:id', updateTransactionHandler);

// DELETE /api/transactions/:id
router.delete('/:id', deleteTransactionHandler);

// POST /api/transactions/import  (multipart/form-data, field: "file")
router.post('/import', upload.single('file'), importCSVHandler);

export default router;
