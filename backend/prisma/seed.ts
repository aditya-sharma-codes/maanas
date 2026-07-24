import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create admin user
  const adminEmail = 'admin@manas.local';
  const existingAdmin = await prisma.institute.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('Admin@123', 10);
    await prisma.institute.create({
      data: {
        name: 'MANAS Administrator',
        email: adminEmail,
        password: hashedPassword,
      },
    });
    console.log(`Created admin user with email: ${adminEmail}`);
  } else {
    console.log(`Admin user with email ${adminEmail} already exists.`);
  }

  // Seed Weather Recommendations
  const defaultRecommendations = [
    {
      weatherCategory: 'Sunny',
      recommendations: ['Maintain routine', 'Gratitude Journal'],
    },
    {
      weatherCategory: 'Partly Cloudy',
      recommendations: ['Breathing exercises', 'Bubble Pop game'],
    },
    {
      weatherCategory: 'Cloudy',
      recommendations: ['Deep breathing', 'Book Counselor', 'Stress relief games'],
    },
    {
      weatherCategory: 'Stormy',
      recommendations: ['Emergency Help', 'Counselor', 'Government Helpline'],
    },
  ];

  for (const rec of defaultRecommendations) {
    const existing = await prisma.weatherRecommendation.findUnique({
      where: { weatherCategory: rec.weatherCategory },
    });
    if (!existing) {
      await prisma.weatherRecommendation.create({
        data: rec,
      });
    }
  }
  console.log('Seeded weather recommendations.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
