"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDepartmentAnalysis = exports.getDashboardStats = void 0;
const prisma_1 = require("../lib/prisma");
const getDashboardStats = async () => {
    const [totalAssessments, uniqueDevices, appointments] = await Promise.all([
        prisma_1.prisma.assessment.count(),
        prisma_1.prisma.assessmentHistory.count(), // Assuming one per device or group it later
        prisma_1.prisma.appointment.count(),
    ]);
    const recentAssessments = await prisma_1.prisma.assessment.findMany({
        take: 10,
        orderBy: { timestamp: 'desc' },
    });
    return {
        totalAssessments,
        uniqueDevices,
        appointments,
        recentAssessments,
    };
};
exports.getDashboardStats = getDashboardStats;
const getDepartmentAnalysis = async () => {
    const assessments = await prisma_1.prisma.assessment.groupBy({
        by: ['department'],
        _avg: { score: true },
        _count: { id: true },
    });
    return assessments;
};
exports.getDepartmentAnalysis = getDepartmentAnalysis;
