import { Router } from 'express';
import { register, login, me, syncFirebase, googleAuth } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleAuth);
router.get('/me', authenticateToken, me);
router.post('/firebase-sync', authenticateToken, syncFirebase);

export default router;
