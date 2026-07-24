import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const loginInstitute = async (email: string, password: string) => {
  const institute = await prisma.institute.findUnique({ where: { email } });
  if (!institute) throw new Error('Invalid credentials');

  const isMatch = await bcrypt.compare(password, institute.password);
  if (!isMatch) throw new Error('Invalid credentials');

  const token = jwt.sign(
    { id: institute.id, email: institute.email },
    process.env.JWT_SECRET || 'supersecret_jwt_key_for_manas',
    { expiresIn: '1d' }
  );

  return { token, user: { id: institute.id, name: institute.name, email: institute.email } };
};
