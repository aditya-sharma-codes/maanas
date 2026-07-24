import { Router } from 'express';
import { fetchCounselors, createAppointment, fetchAppointments } from '../controllers/appointmentController';
import { validateRequest } from '../middleware/auth';
import { bookAppointmentSchema } from '../validators';

const router = Router();

router.get('/counselors', fetchCounselors);
router.post('/', validateRequest(bookAppointmentSchema), createAppointment);
router.get('/', fetchAppointments);

export default router;
