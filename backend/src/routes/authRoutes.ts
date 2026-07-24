import { Router } from 'express';
import { login } from '../controllers/authController';
import { validateRequest } from '../middleware/auth';
import { loginSchema } from '../validators';

const router = Router();

router.post('/login', validateRequest(loginSchema), login);

export default router;
