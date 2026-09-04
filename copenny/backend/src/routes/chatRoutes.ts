import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  generateInsights,
  generateActions,
  explainInsight,
  classifyTransaction,
  executeAction,
  chatQuery
} from '../controllers/chatController';

const router = Router();

// All chat/AI routes require authentication
router.use(authenticateToken);

router.post('/insights', generateInsights);
router.post('/actions', generateActions);
router.post('/explain', explainInsight);
router.post('/classify', classifyTransaction);
router.post('/execute-action', executeAction);
router.post('/query', chatQuery);

export default router;
