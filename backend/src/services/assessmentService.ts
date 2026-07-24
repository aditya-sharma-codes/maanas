import { prisma } from '../lib/prisma';

export const submitAssessment = async (data: {
  deviceId: string;
  department: string;
  academicYear: string;
  score: number;
  weatherCategory: string;
}) => {
  // Store the assessment
  const assessment = await prisma.assessment.create({
    data,
  });

  // Update or create history for this device
  let history = await prisma.assessmentHistory.findFirst({
    where: { deviceId: data.deviceId },
  });

  if (history) {
    await prisma.assessmentHistory.update({
      where: { id: history.id },
      data: {
        totalScore: history.totalScore + data.score,
        timestamp: new Date(),
      },
    });
  } else {
    await prisma.assessmentHistory.create({
      data: {
        deviceId: data.deviceId,
        totalScore: data.score,
      },
    });
  }

  // Fetch recommendations for this weather category
  const recommendations = await prisma.weatherRecommendation.findUnique({
    where: { weatherCategory: data.weatherCategory },
  });

  return { assessment, recommendations: recommendations?.recommendations || [] };
};
