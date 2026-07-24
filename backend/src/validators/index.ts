import { z } from 'zod';

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
});

export const submitAssessmentSchema = z.object({
  body: z.object({
    deviceId: z.string().min(1, 'Device ID is required'),
    department: z.string().min(1, 'Department is required'),
    academicYear: z.string().min(1, 'Academic Year is required'),
    score: z.number().int().min(0).max(36, 'Score must be between 0 and 36'),
    weatherCategory: z.string().min(1, 'Weather Category is required'),
  }),
});

export const bookAppointmentSchema = z.object({
  body: z.object({
    deviceId: z.string().min(1, 'Device ID is required'),
    counselorId: z.string().min(1, 'Counselor ID is required'),
    date: z.string().datetime({ message: 'Invalid ISO datetime string' }),
  }),
});

export const requestSupportSchema = z.object({
  body: z.object({
    deviceId: z.string().min(1, 'Device ID is required'),
    message: z.string().min(10, 'Message must be at least 10 characters'),
  }),
});
