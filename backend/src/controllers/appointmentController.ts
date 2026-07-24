import { Request, Response, NextFunction } from 'express';
import { getAvailableCounselors, bookAppointment, getAppointments } from '../services/appointmentService';
import { sendSuccess } from '../utils/response';

export const fetchCounselors = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const counselors = await getAvailableCounselors();
    return sendSuccess(res, 'Counselors retrieved', counselors);
  } catch (error) {
    next(error);
  }
};

export const createAppointment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = { ...req.body, date: new Date(req.body.date) };
    const appointment = await bookAppointment(data);
    return sendSuccess(res, 'Appointment booked successfully', appointment, 201);
  } catch (error) {
    next(error);
  }
};

export const fetchAppointments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { deviceId } = req.query;
    if (!deviceId || typeof deviceId !== 'string') {
      return res.status(400).json({ success: false, message: 'deviceId query param is required' });
    }
    const appointments = await getAppointments(deviceId);
    return sendSuccess(res, 'Appointments retrieved', appointments);
  } catch (error) {
    next(error);
  }
};
