"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchAppointments = exports.createAppointment = exports.fetchCounselors = void 0;
const appointmentService_1 = require("../services/appointmentService");
const response_1 = require("../utils/response");
const fetchCounselors = async (req, res, next) => {
    try {
        const counselors = await (0, appointmentService_1.getAvailableCounselors)();
        return (0, response_1.sendSuccess)(res, 'Counselors retrieved', counselors);
    }
    catch (error) {
        next(error);
    }
};
exports.fetchCounselors = fetchCounselors;
const createAppointment = async (req, res, next) => {
    try {
        const data = { ...req.body, date: new Date(req.body.date) };
        const appointment = await (0, appointmentService_1.bookAppointment)(data);
        return (0, response_1.sendSuccess)(res, 'Appointment booked successfully', appointment, 201);
    }
    catch (error) {
        next(error);
    }
};
exports.createAppointment = createAppointment;
const fetchAppointments = async (req, res, next) => {
    try {
        const { deviceId } = req.query;
        if (!deviceId || typeof deviceId !== 'string') {
            return res.status(400).json({ success: false, message: 'deviceId query param is required' });
        }
        const appointments = await (0, appointmentService_1.getAppointments)(deviceId);
        return (0, response_1.sendSuccess)(res, 'Appointments retrieved', appointments);
    }
    catch (error) {
        next(error);
    }
};
exports.fetchAppointments = fetchAppointments;
