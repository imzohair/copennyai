import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  getGoals,
  createGoal,
  updateGoalProgress,
  deleteGoal
} from '../controllers/goalController';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

router.get('/', getGoals);
router.post('/', createGoal);
router.put('/:id/progress', updateGoalProgress);
router.delete('/:id', deleteGoal);

export default router;
