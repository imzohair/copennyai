import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  getSubscriptions,
  createSubscription,
  updateSubscription,
  deleteSubscription,
  detectSubscriptions
} from '../controllers/subscriptionController';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

router.get('/', getSubscriptions);
router.post('/', createSubscription);
router.put('/:id', updateSubscription);
router.delete('/:id', deleteSubscription);
router.post('/detect', detectSubscriptions);

export default router;
