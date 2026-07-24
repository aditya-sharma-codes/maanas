import { Router } from 'express';
import { createAssessment } from '../controllers/assessmentController';
import { validateRequest } from '../middleware/auth';
import { submitAssessmentSchema } from '../validators';

const router = Router();

router.post('/', validateRequest(submitAssessmentSchema), createAssessment);

export default router;
