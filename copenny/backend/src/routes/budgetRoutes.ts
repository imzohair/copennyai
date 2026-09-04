import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  getBudgets,
  createBudget,
  updateBudget,
  deleteBudget
} from '../controllers/budgetController';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

router.get('/', getBudgets);
router.post('/', createBudget);
router.put('/:id', updateBudget);
router.delete('/:id', deleteBudget);

export default router;
