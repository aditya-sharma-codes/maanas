import { prisma } from '../lib/prisma';

export const getDashboardStats = async () => {
  const [totalAssessments, uniqueDevices, appointments] = await Promise.all([
    prisma.assessment.count(),
    prisma.assessmentHistory.count(), // Assuming one per device or group it later
    prisma.appointment.count(),
  ]);

  const recentAssessments = await prisma.assessment.findMany({
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

export const getDepartmentAnalysis = async () => {
  const assessments = await prisma.assessment.groupBy({
    by: ['department'],
    _avg: { score: true },
    _count: { id: true },
  });
  return assessments;
};
