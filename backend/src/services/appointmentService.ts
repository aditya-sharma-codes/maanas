import { prisma } from '../lib/prisma';

export const getAvailableCounselors = async () => {
  return prisma.counselor.findMany({
    where: { available: true },
  });
};

export const bookAppointment = async (data: {
  deviceId: string;
  counselorId: string;
  date: Date;
}) => {
  const counselor = await prisma.counselor.findUnique({
    where: { id: data.counselorId },
  });
  if (!counselor || !counselor.available) {
    throw new Error('Counselor is not available');
  }

  const appointment = await prisma.appointment.create({
    data: {
      deviceId: data.deviceId,
      counselorId: data.counselorId,
      date: data.date,
      status: 'PENDING',
    },
  });

  return appointment;
};

export const getAppointments = async (deviceId: string) => {
  return prisma.appointment.findMany({
    where: { deviceId },
    include: { counselor: true },
    orderBy: { date: 'desc' },
  });
};
