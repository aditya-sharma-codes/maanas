"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestSupportSchema = exports.bookAppointmentSchema = exports.submitAssessmentSchema = exports.loginSchema = void 0;
const zod_1 = require("zod");
exports.loginSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email('Invalid email address'),
        password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
    }),
});
exports.submitAssessmentSchema = zod_1.z.object({
    body: zod_1.z.object({
        deviceId: zod_1.z.string().min(1, 'Device ID is required'),
        department: zod_1.z.string().min(1, 'Department is required'),
        academicYear: zod_1.z.string().min(1, 'Academic Year is required'),
        score: zod_1.z.number().int().min(0).max(36, 'Score must be between 0 and 36'),
        weatherCategory: zod_1.z.string().min(1, 'Weather Category is required'),
    }),
});
exports.bookAppointmentSchema = zod_1.z.object({
    body: zod_1.z.object({
        deviceId: zod_1.z.string().min(1, 'Device ID is required'),
        counselorId: zod_1.z.string().min(1, 'Counselor ID is required'),
        date: zod_1.z.string().datetime({ message: 'Invalid ISO datetime string' }),
    }),
});
exports.requestSupportSchema = zod_1.z.object({
    body: zod_1.z.object({
        deviceId: zod_1.z.string().min(1, 'Device ID is required'),
        message: zod_1.z.string().min(10, 'Message must be at least 10 characters'),
    }),
});
