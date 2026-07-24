"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAppointments = exports.bookAppointment = exports.getAvailableCounselors = void 0;
const prisma_1 = require("../lib/prisma");
const getAvailableCounselors = async () => {
    return prisma_1.prisma.counselor.findMany({
        where: { available: true },
    });
};
exports.getAvailableCounselors = getAvailableCounselors;
const bookAppointment = async (data) => {
    const counselor = await prisma_1.prisma.counselor.findUnique({
        where: { id: data.counselorId },
    });
    if (!counselor || !counselor.available) {
        throw new Error('Counselor is not available');
    }
    const appointment = await prisma_1.prisma.appointment.create({
        data: {
            deviceId: data.deviceId,
            counselorId: data.counselorId,
            date: data.date,
            status: 'PENDING',
        },
    });
    return appointment;
};
exports.bookAppointment = bookAppointment;
const getAppointments = async (deviceId) => {
    return prisma_1.prisma.appointment.findMany({
        where: { deviceId },
        include: { counselor: true },
        orderBy: { date: 'desc' },
    });
};
exports.getAppointments = getAppointments;
