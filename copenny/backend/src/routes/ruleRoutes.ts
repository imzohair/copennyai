import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  getRules,
  createRule,
  updateRule,
  deleteRule
} from '../controllers/ruleController';

const router = Router();

router.use(authenticateToken);

router.get('/', getRules);
router.post('/', createRule);
router.put('/:id', updateRule);
router.delete('/:id', deleteRule);

export default router;
