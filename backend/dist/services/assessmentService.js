"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitAssessment = void 0;
const prisma_1 = require("../lib/prisma");
const submitAssessment = async (data) => {
    // Store the assessment
    const assessment = await prisma_1.prisma.assessment.create({
        data,
    });
    // Update or create history for this device
    let history = await prisma_1.prisma.assessmentHistory.findFirst({
        where: { deviceId: data.deviceId },
    });
    if (history) {
        await prisma_1.prisma.assessmentHistory.update({
            where: { id: history.id },
            data: {
                totalScore: history.totalScore + data.score,
                timestamp: new Date(),
            },
        });
    }
    else {
        await prisma_1.prisma.assessmentHistory.create({
            data: {
                deviceId: data.deviceId,
                totalScore: data.score,
            },
        });
    }
    // Fetch recommendations for this weather category
    const recommendations = await prisma_1.prisma.weatherRecommendation.findUnique({
        where: { weatherCategory: data.weatherCategory },
    });
    return { assessment, recommendations: recommendations?.recommendations || [] };
};
exports.submitAssessment = submitAssessment;
