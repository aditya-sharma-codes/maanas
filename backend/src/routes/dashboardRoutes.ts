import { Router } from 'express';
import { getStats, getDepartments } from '../controllers/dashboardController';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

// These endpoints require institute login
router.use(authenticateJWT);

router.get('/stats', getStats);
router.get('/departments', getDepartments);

export default router;
